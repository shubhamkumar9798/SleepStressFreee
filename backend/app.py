"""
Sleep StressFree — Flask Backend (SQLite edition)
No external database needed — SQLite is built into Python.

Run:
    cd backend
    python app.py
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3, pickle, numpy as np, os, hashlib
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = "sleepstressfree_secret_key_2024"
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# ── SQLite ─────────────────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            name     TEXT    NOT NULL,
            email    TEXT    UNIQUE NOT NULL,
            password TEXT    NOT NULL,
            created  TEXT    DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS predictions (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id      INTEGER NOT NULL,
            user_name    TEXT,
            sr           REAL, rr  REAL, t   REAL, lm  REAL,
            bo           REAL, rem REAL, hr  REAL, sr2 REAL,
            stress_level INTEGER,
            stress_label TEXT,
            confidence   REAL,
            created      TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """)
    print("✅ SQLite database ready →", DB_PATH)

# ── Load ML Model ──────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(__file__)
MODEL_PATH  = os.path.join(BASE_DIR, "models", "stress_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("Run `python train_model.py` first!")

with open(MODEL_PATH,  "rb") as f: model  = pickle.load(f)
with open(SCALER_PATH, "rb") as f: scaler = pickle.load(f)

STRESS_INFO = {
    0: {
        "label": "No Stress", "color": "#4ade80", "emoji": "😌",
        "desc": "Your sleep vitals are excellent. You're in a peak recovery state.",
        "tips": [
            {"icon":"🧘","title":"Maintain your sleep schedule","text":"Keep going to bed and waking at the same time — your circadian rhythm is perfectly calibrated."},
            {"icon":"🥗","title":"Continue healthy habits","text":"Your blood oxygen and REM sleep are optimal. Sustain your current diet and hydration routine."},
            {"icon":"📵","title":"Screen curfew before bed","text":"Avoid screens 30–45 mins before sleep to maintain your excellent melatonin production."},
            {"icon":"🏃","title":"Morning movement","text":"Light morning exercise will further strengthen your low-stress baseline over time."},
        ]
    },
    1: {
        "label": "Low Stress", "color": "#2dd4bf", "emoji": "🙂",
        "desc": "Minor stress signals detected. A few tweaks will restore perfect sleep.",
        "tips": [
            {"icon":"🌬️","title":"4-7-8 Breathing","text":"Inhale 4 sec, hold 7, exhale 8. Do 4 cycles before bed to naturally lower cortisol."},
            {"icon":"🛏️","title":"Sleep posture check","text":"Slight limb movement detected — a body pillow or knee pillow can reduce nighttime restlessness."},
            {"icon":"🫁","title":"Fresh air walks","text":"10-minute walks outdoors improve overnight blood oxygen saturation noticeably."},
            {"icon":"🎵","title":"White noise or nature sounds","text":"Ambient audio deepens REM sleep and reduces micro-awakenings significantly."},
        ]
    },
    2: {
        "label": "Medium Stress", "color": "#fbbf24", "emoji": "😐",
        "desc": "Moderate stress is affecting your sleep architecture. Action is recommended.",
        "tips": [
            {"icon":"🧊","title":"Cool shower before bed","text":"A 2-min cool shower drops core body temperature, reliably triggering deeper non-REM sleep."},
            {"icon":"📔","title":"Worry journaling","text":"Write 3 concerns + 3 wins before bed to offload your mental buffer and reduce sleep latency."},
            {"icon":"🚫","title":"Cut caffeine after 2 PM","text":"Caffeine has a 6-hour half-life — a 3 PM coffee still has 50% potency at 9 PM bedtime."},
            {"icon":"🌙","title":"Blackout curtains","text":"Complete darkness improves melatonin production by up to 50%, directly reducing sleep-time stress."},
            {"icon":"💊","title":"Magnesium Glycinate","text":"200–400mg before bed is a natural relaxant that supports muscle recovery and REM depth."},
        ]
    },
    3: {
        "label": "High Stress", "color": "#f97316", "emoji": "😟",
        "desc": "High stress is significantly impacting your sleep quality. Intervention is needed.",
        "tips": [
            {"icon":"🏥","title":"Consult a sleep specialist","text":"Persistent high stress with elevated heart rate and snoring warrants professional evaluation."},
            {"icon":"📱","title":"Track Heart Rate Variability","text":"Use a smartwatch to monitor HRV — it's the most reliable real-time stress biomarker available."},
            {"icon":"🧠","title":"Progressive muscle relaxation","text":"Tense then release each muscle group from toes up for 20 minutes — reduces sleep anxiety by ~40%."},
            {"icon":"⏰","title":"Strict sleep hygiene","text":"Fixed bed/wake times ±15 min, no exceptions — even weekends. Consistency is the single biggest lever."},
            {"icon":"🫖","title":"Ashwagandha tea","text":"Clinical studies show 300mg Ashwagandha before bed reduces cortisol levels by approximately 30%."},
            {"icon":"🚶","title":"Evening walk","text":"A 30-min leisurely walk at sunset regulates circadian rhythm and lowers blood pressure naturally."},
        ]
    },
    4: {
        "label": "Very High Stress", "color": "#ef4444", "emoji": "😰",
        "desc": "Critical stress levels detected. Immediate lifestyle changes and medical advice are strongly recommended.",
        "tips": [
            {"icon":"🚨","title":"Seek medical attention","text":"Very high stress with these vitals may indicate sleep apnea, anxiety disorder, or cardiovascular strain."},
            {"icon":"🫀","title":"Monitor heart rate","text":"Your elevated heart rate and snoring range suggest potential cardiovascular stress — track it daily."},
            {"icon":"🩺","title":"Sleep study (polysomnography)","text":"A clinical sleep study can definitively identify the root cause of severe sleep disruption."},
            {"icon":"🧘","title":"MBSR Program","text":"Mindfulness-Based Stress Reduction programs have a proven 40% reduction in stress scores within 8 weeks."},
            {"icon":"🥛","title":"Eliminate alcohol","text":"Even one drink fragments REM sleep and worsens snoring — eliminate it temporarily to re-establish baseline."},
            {"icon":"💙","title":"Talk to someone","text":"High chronic stress impacts mental health significantly. A therapist can build lasting coping strategies."},
        ]
    }
}

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def row_to_dict(row):
    return dict(row) if row else None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

# ── Auth ───────────────────────────────────────────────────────────────────────
@app.route("/api/register", methods=["POST"])
def register():
    data  = request.get_json()
    name  = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    pw    = data.get("password", "")
    if not name or not email or not pw:
        return jsonify({"error": "All fields are required"}), 400
    if len(pw) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    try:
        with get_db() as db:
            db.execute("INSERT INTO users (name,email,password) VALUES (?,?,?)",
                       (name, email, hash_pw(pw)))
        with get_db() as db:
            user = row_to_dict(db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone())
        session["user_id"]    = user["id"]
        session["user_name"]  = user["name"]
        session["user_email"] = user["email"]
        return jsonify({"success": True, "user": {"name": user["name"], "email": user["email"]}})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409

@app.route("/api/login", methods=["POST"])
def login():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()
    pw    = data.get("password", "")
    with get_db() as db:
        user = row_to_dict(db.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (email, hash_pw(pw))).fetchone())
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    session["user_id"]    = user["id"]
    session["user_name"]  = user["name"]
    session["user_email"] = user["email"]
    return jsonify({"success": True, "user": {"name": user["name"], "email": user["email"]}})

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})

@app.route("/api/me")
@login_required
def me():
    return jsonify({"id": session["user_id"], "name": session["user_name"], "email": session["user_email"]})

# ── Predict ────────────────────────────────────────────────────────────────────
@app.route("/api/predict", methods=["POST"])
@login_required
def predict():
    data = request.get_json()
    try:
        features = [float(data["sr"]), float(data["rr"]), float(data["t"]),
                    float(data["lm"]), float(data["bo"]), float(data["rem"]),
                    float(data["hr"]), float(data["sr2"])]
    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    arr    = np.array(features).reshape(1, -1)
    arr_sc = scaler.transform(arr)
    level  = int(model.predict(arr_sc)[0])
    proba  = model.predict_proba(arr_sc)[0].tolist()
    info   = STRESS_INFO[level]

    with get_db() as db:
        db.execute("""INSERT INTO predictions
            (user_id,user_name,sr,rr,t,lm,bo,rem,hr,sr2,stress_level,stress_label,confidence)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (session["user_id"], session["user_name"],
             *features, level, info["label"], round(proba[level]*100, 1)))

    return jsonify({
        "stress_level": level, "stress_label": info["label"],
        "color": info["color"], "emoji": info["emoji"], "desc": info["desc"],
        "confidence":   round(proba[level]*100, 1),
        "all_proba":    [round(p*100, 1) for p in proba],
        "tips":         info["tips"],
    })

# ── History & Stats ────────────────────────────────────────────────────────────
@app.route("/api/history")
@login_required
def history():
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM predictions WHERE user_id=? ORDER BY created DESC LIMIT 50",
            (session["user_id"],)).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        d["features"] = {"sr":d["sr"],"rr":d["rr"],"t":d["t"],"lm":d["lm"],
                         "bo":d["bo"],"rem":d["rem"],"hr":d["hr"],"sr2":d["sr2"]}
        result.append(d)
    return jsonify(result)

@app.route("/api/stats")
@login_required
def stats():
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM predictions WHERE user_id=? ORDER BY created DESC",
            (session["user_id"],)).fetchall()
    if not rows:
        return jsonify({"total":0,"avg_stress":None,"trend":[],"distribution":[0,0,0,0,0]})
    rows   = [dict(r) for r in rows]
    levels = [r["stress_level"] for r in rows]
    dist   = [levels.count(i) for i in range(5)]
    avg    = round(sum(levels)/len(levels), 2)
    labels = {0:"No Stress",1:"Low Stress",2:"Medium Stress",3:"High Stress",4:"Very High Stress"}
    trend  = [{"date": r["created"][:10], "level": r["stress_level"]} for r in rows[:10]][::-1]
    return jsonify({
        "total": len(rows), "avg_stress": avg, "avg_label": labels[round(avg)],
        "best": min(levels), "worst": max(levels),
        "latest": levels[0], "latest_label": labels[levels[0]],
        "distribution": dist, "trend": trend,
    })

# ── Start ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    print("\n🌙 Sleep StressFree backend running!")
    print("   → API:  http://localhost:5000")
    print("   → Open: http://localhost:3000  (after npm start)\n")
    app.run(debug=True, port=5000)
