# 🌙 Sleep StressFree

> AI-powered sleep stress prediction — Flask + React + MongoDB + scikit-learn

---

## 📁 Project Structure

```
sleepstressfree/
├── backend/
│   ├── app.py               ← Flask REST API (all routes + ML inference)
│   ├── train_model.py       ← Train Random Forest on SaYoPillow dataset
│   ├── requirements.txt     ← Python dependencies
│   └── models/
│       ├── stress_model.pkl ← Trained RF model (auto-generated)
│       └── scaler.pkl       ← StandardScaler (auto-generated)
│
└── frontend/
    ├── package.json         ← React dependencies
    ├── public/index.html    ← HTML entry point
    └── src/
        ├── App.js           ← Router + auth guards
        ├── index.js         ← React entry point
        ├── index.css        ← Global CSS variables
        ├── context/
        │   └── AuthContext.js   ← Global auth state
        ├── pages/
        │   ├── AuthPage.js      ← Login + Register page
        │   └── Dashboard.js     ← Main dashboard shell
        └── components/
            ├── Sidebar.js       ← Navigation sidebar
            ├── Overview.js      ← Stats, charts, summary
            ├── PredictTab.js    ← Prediction form + results
            └── OtherTabs.js     ← History, Tips, About tabs
```

---

## ⚙️ Setup & Run

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (run once — generates models/*.pkl)
python train_model.py

# Start the Flask API server
python app.py
# → Running on http://localhost:5000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend

# Install Node dependencies
npm install

# Start the React dev server
npm start
# → Opens http://localhost:3000
```

### 4. Open the App
Visit **http://localhost:3000** — register an account and start analysing!

---

## 🧠 Machine Learning Model

| Property | Value |
|---|---|
| **Algorithm** | Random Forest Classifier |
| **Library** | scikit-learn |
| **n_estimators** | 200 trees |
| **max_depth** | 10 |
| **Preprocessing** | StandardScaler normalization |
| **Train/Test Split** | 80% / 20% |
| **Test Accuracy** | **100%** |
| **Dataset** | SaYoPillow.csv |

### Input Features (8 biomarkers)
| Feature | Description | Range |
|---|---|---|
| sr | Snoring Range | 40–100 |
| rr | Respiration Rate | 14–30 |
| t | Body Temperature °F | 85–100 |
| lm | Limb Movement | 3–20 |
| bo | Blood Oxygen Level % | 80–100 |
| rem | REM Sleep index | 55–105 |
| hr | Heart Rate delta | 0–10 |
| sr2 | SR Index | 48–85 |

### Output (Stress Level)
| Level | Label | Color |
|---|---|---|
| 0 | No Stress | 🟢 Green |
| 1 | Low Stress | 🩵 Teal |
| 2 | Medium Stress | 🟡 Amber |
| 3 | High Stress | 🟠 Orange |
| 4 | Very High Stress | 🔴 Red |

---

## 🗄️ MongoDB Collections

**Database:** `sleepstressfree`

**`users` collection:**
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<sha256_hash>",
  "created": ISODate
}
```

**`predictions` collection:**
```json
{
  "_id": ObjectId,
  "user_id": "<user_id_string>",
  "user_name": "John Doe",
  "features": { "sr": 60, "rr": 20, "t": 92, "lm": 10, "bo": 90, "rem": 85, "hr": 2, "sr2": 62 },
  "stress_level": 2,
  "stress_label": "Medium Stress",
  "confidence": 92.5,
  "created": ISODate
}
```

---

## 🌐 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Get current user |
| POST | `/api/predict` | Run stress prediction |
| GET | `/api/history` | Get prediction history |
| GET | `/api/stats` | Get user stats + trend |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3 + Flask |
| **ML** | scikit-learn (Random Forest) |
| **Database** | MongoDB (via pymongo) |
| **Auth** | Session-based + SHA-256 password hashing |
| **Frontend** | React 18 (Create React App) |
| **Routing** | React Router v6 |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Fonts** | Google Fonts (Sora + DM Sans) |

---

## ✨ Features

- ✅ User Registration & Login with hashed passwords
- ✅ Protected routes (auth guards on both frontend and backend)
- ✅ 8-slider intuitive input form for all biomarkers
- ✅ Random Forest ML model with 100% test accuracy
- ✅ 5-level stress classification with confidence scores
- ✅ SVG arc meter visualization for results
- ✅ Personalized evidence-based suggestions per stress level
- ✅ MongoDB-backed prediction history (per user)
- ✅ Trend line chart + distribution donut chart
- ✅ Beautiful dark-themed dashboard UI
- ✅ Fully responsive layout
# SleepStressFreee
