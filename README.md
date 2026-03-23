# 🏦 CREDIS - Behavioral Credit Intelligence System

## 📋 Overview

**CREDIS** is an intelligent AI-powered behavioral credit scoring system designed for India's gig economy workers. It analyzes worker financial behavior, spending patterns, and work consistency to generate a **CREDIS Score (0-100)** and risk classification, enabling microfinance lenders to make faster, fairer lending decisions.

### Key Features:
- ✅ **6-Stage AI Agent Pipeline**: Multi-agent analysis with ASI-1 AI validation
- ✅ **Behavioral Scoring**: 5-signal framework analyzing income stability, platform reliability, work consistency, spending discipline, and income growth
- ✅ **Risk Classification**: 4-tier risk band system (Low/High Risk, High/Low Need)
- ✅ **Lender Matching**: Automatic recommendation of best-fit lenders from available pool
- ✅ **Growth Roadmap**: 12-month personalized roadmap for credit score improvement
- ✅ **Interactive Dashboard**: Streamlit web interface with Plotly visualizations
- ✅ **JSON Output**: Structured results for integration with loan management systems

---

## 🗂️ Project Structure

```
e:\project\Credis\
├── agents/                          # AI Agent implementations (6 sequential stages)
│   ├── agent1_dataweaver.py        # Stage 1: Load & structure worker JSON data
│   ├── agent2_patternmind.py       # Stage 2: Analyze 12-month behavioral patterns
│   ├── agent3_identityforge.py     # Stage 3: Calculate CREDIS Score (0-100)
│   ├── agent4_riskguard.py         # Stage 4: Risk classification & loan decision
│   ├── agent5_opportunityscout.py  # Stage 5: Match eligible lenders
│   └── agent6_growthcoach.py       # Stage 6: Generate roadmap & save results
│
├── dashboard/
│   └── app.py                       # Streamlit web dashboard (http://localhost:8502)
│
├── shared/
│   ├── asi1_client.py              # ASI-1 API client (Bearer token auth)
│   └── gemini_client.py            # Google Gemini API client
│
├── output/                          # Generated JSON results
│   ├── result_W001.json            # Complete CREDIS report for worker W001
│   ├── result_W002.json
│   ├── result_W003.json
│   ├── result_W004.json
│   └── result_W005.json
│
├── User Details/                    # Worker profiles (input data)
│   ├── W001.json                   # Ravi Kumar / Swiggy
│   ├── W002.json
│   ├── W003.json
│   ├── W004.json
│   └── W005.json
│
├── config.py                        # Configuration settings
├── lenders.json                     # Available lenders database
├── requirements.txt                 # Python dependencies (54 packages)
├── .env                            # Environment variables (API keys)
└── venv/                           # Python virtual environment
```

---

## 🤖 Six-Stage Agent Pipeline

### **Agent 1: DataWeaver** ⚙️
**File**: `agents/agent1_dataweaver.py`  
**Purpose**: Load and structure worker profile data  

**What it does:**
- Reads JSON file from `User Details/{worker_id}.json`
- Extracts 18 core worker fields:
  - Basic info: worker_id, name, age, email, phone
  - Platform data: platform, monthly_earnings, rating
  - Financial products: RD (Recurring Deposit), Insurance, CKYC status
  - Account metrics: NBCFDC history, current balance
  - 12-month earnings array
- Validates data completeness with ASI-1
- Returns structured worker_data dictionary

**Output**: 
```json
{
  "worker_id": "W001",
  "worker_name": "Ravi Kumar",
  "platform": "Swiggy",
  "monthly_earnings": 28000,
  "rating": 4.8,
  "has_rd": true,
  "rd_amount": 1000,
  "earnings_12_months": [26000, 27000, 28000, ...]
}
```

---

### **Agent 2: PatternMind** 📊
**File**: `agents/agent2_patternmind.py`  
**Purpose**: Analyze 12-month behavioral patterns  

**What it does:**
- Calculates 20+ behavioral metrics from 12-month earnings history:
  - **Income Stability**: Coefficient of Variation (lower = more stable)
  - **Active Months**: Count of months with earnings > 0
  - **Income Growth**: Percentage change from H1 to H2 (first 6 vs last 6 months)
  - **Rental Payment Compliance**: Count of successful rent payments
  - **H1/H2 Averages**: First half vs second half income averages
- Analyzes platform rating, cancellation rate, work frequency
- Gets behavioral validation from ASI-1 AI
- Identifies strongest and weakest behavioral signals

**Output**:
```json
{
  "avg_monthly_income": 27500,
  "income_cv": 0.11,
  "h1_avg": 27000,
  "h2_avg": 28000,
  "growth_pct": 1.3,
  "active_months": 12,
  "rent_payments": 11,
  "behavioral_analysis": "Worker shows excellent income stability with CV 0.11..."
}
```

---

### **Agent 3: IdentityForge** 🔐
**File**: `agents/agent3_identityforge.py`  
**Purpose**: Calculate CREDIS Score (0-100)  

**What it does:**
- Computes 5-signal weighted scoring framework:
  - **Income Stability** (30%): Based on income coefficient of variation
  - **Platform Reliability** (25%): Platform rating and reviews
  - **Work Consistency** (20%): Months active, no gaps
  - **Spending Discipline** (15%): RD/Insurance presence, balance trends
  - **Income Growth** (10%): YoY growth percentage
- Applies adjustments:
  - **CKYC Verified**: +5 points (KYC compliance)
  - **CKYC Not Verified**: -10 points
  - **NBCFDC Member**: +10 points (government scheme participation)
  - **NBCFDC Lapsed**: -5 points
- Final score: 0-100 normalized range
- Gets AI confirmation from ASI-1

**Output**:
```json
{
  "credis_score": 98.8,
  "score_label": "Excellent",
  "signal_scores": {
    "income_stability": 80,
    "platform_reliability": 95,
    "work_consistency": 100,
    "spending_discipline": 100,
    "income_growth": 60
  },
  "adjustments": {
    "ckyc": 5,
    "nbcfdc": 10
  },
  "base_score": 83.8
}
```

---

### **Agent 4: RiskGuard** ⚠️
**File**: `agents/agent4_riskguard.py`  
**Purpose**: Classify risk band and make loan decision  

**What it does:**
- Classifies worker into 4-tier risk band system:
  
| CREDIS Score | Risk Band | Loan Decision | Max Amount | Approval | Default Risk |
|---|---|---|---|---|---|
| ≥ 75 | LOW_RISK_HIGH_NEED | **APPROVE_FAST** | Rs.300,000 | 1 day | Very Low |
| ≥ 60 | LOW_RISK_LOW_NEED | **APPROVE_STANDARD** | Rs.150,000 | 7 days | Low |
| ≥ 40 | HIGH_RISK_HIGH_NEED | **APPROVE_CAPPED** | Rs.50,000 | 14 days | Medium |
| < 40 | HIGH_RISK_LOW_NEED | **COACHING_ONLY** | Rs.0 | N/A | High |

- Recommends approval timeline (1, 7, 14 days or coaching)
- Documents decision rationale with ASI-1 confirmation

**Output**:
```json
{
  "risk_band": "LOW_RISK_HIGH_NEED",
  "band_label": "Low Risk — High Need",
  "loan_decision": "APPROVE_FAST",
  "decision_reason": "Excellent CREDIS score indicates low default risk",
  "max_loan": 300000,
  "approval_days": 1,
  "approval_timeline": "Fast-track approval within 1 business day"
}
```

---

### **Agent 5: OpportunityScout** 🏦
**File**: `agents/agent5_opportunityscout.py`  
**Purpose**: Match eligible lenders and rank by fit  

**What it does:**
- Reads `lenders.json` database (8+ government & private lenders)
- Filters eligible lenders by criteria:
  - Worker CREDIS score ≥ lender's minimum required
  - Monthly income ≥ lender's minimum requirement
  - Loan amount ≤ lender's maximum offering
- Ranks matches by:
  1. Interest rate (lower is better)
  2. Loan amount available
  3. Approval speed
- Selects top 3 recommendations for loan officer
- Each recommendation includes: lender name, rate, max amount, approval time

**Output**:
```json
{
  "total_eligible_lenders": 8,
  "all_eligible": [
    {
      "lender_name": "NBCFDC",
      "loan_details": {
        "interest_rate_percent": 8,
        "max_amount": 300000
      },
      "process": {
        "approval_time_days": 3
      }
    }
  ],
  "top3_lenders": [
    {"lender_name": "NBCFDC", "rate": 8, "max": 300000, "approval_days": 3},
    {"lender_name": "PM SVANidhi", "rate": 7, "max": 200000, "approval_days": 2},
    {"lender_name": "MUDRA Shishu", "rate": 10, "max": 50000, "approval_days": 1}
  ]
}
```

---

### **Agent 6: GrowthCoach** 🚀
**File**: `agents/agent6_growthcoach.py`  
**Purpose**: Generate 12-month growth roadmap & save complete results  

**What it does:**
- Analyzes worker's current strengths and improvement areas
- Creates personalized 12-month roadmap with:
  - Month-by-month income growth targets
  - Suggested actions (platform optimization, financial discipline, skill building)
  - Risk mitigation strategies
  - Milestones for CREDIS score improvement
- Concatenates all outputs from Agents 1-5 into complete CREDIS report
- Saves full JSON to `output/result_{worker_id}.json`
- Supports command-line arguments: `python agent6_growthcoach.py W001`

**Output** (saved to JSON):
```json
{
  "worker_id": "W001",
  "worker_name": "Ravi Kumar",
  "platform": "Swiggy",
  "credis_score": 98.8,
  "risk_band": "LOW_RISK_HIGH_NEED",
  "max_loan": 300000,
  "growth_roadmap": "## 12-Month Growth Roadmap for Ravi Kumar\n\n### Month 1-2: Foundation Building\n- Maintain current income stability (target: 28,000+)\n- Enroll in advanced platform features\n- Start emergency fund (target: Rs.15,000)\n\n### Month 3-4: Optimization Phase\n- Increase monthly income to Rs.30,000 (+7%)\n- Maintain 100% delivery rating\n...",
  "top3_lenders": [...],
  "all_agent_outputs": {...}
}
```

---

## 📊 Complete Data Flow

```
Worker JSON File (W001.json)
    ↓
[Agent 1: DataWeaver] → Extract 18 fields + ASI-1 validation
    ↓
[Agent 2: PatternMind] → Calculate 20+ behavioral metrics
    ↓
[Agent 3: IdentityForge] → Compute CREDIS Score (0-100)
    ↓
[Agent 4: RiskGuard] → Classify risk band + loan decision
    ↓
[Agent 5: OpportunityScout] → Match eligible lenders
    ↓
[Agent 6: GrowthCoach] → Generate roadmap + save JSON
    ↓
result_{worker_id}.json (Complete CREDIS Report)
    ↓
Dashboard Visualization (Streamlit)
```

---

## 🚀 Quick Start

### **1️⃣ Initial Setup**

```powershell
# Navigate to project
cd "e:\project\Credis"

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### **2️⃣ Configure API Keys**

Create `.env` file in project root with your API keys:
```
ASI1_API_KEY=your_asi1_api_key_here
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

### **3️⃣ Run Complete Pipeline for a Worker**

```powershell
# Process single worker (generates all agents + saves JSON)
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W001

# Process multiple workers
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W001
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W002
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W003
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W004
.\venv\Scripts\python.exe agents/agent6_growthcoach.py W005
```

### **4️⃣ Launch Interactive Dashboard**

```powershell
# Start dashboard on http://localhost:8502
.\venv\Scripts\python.exe -m streamlit run dashboard/app.py

# Alternative (with error suppression)
.\venv\Scripts\python.exe -m streamlit run dashboard/app.py --logger.level=error
```

### **5️⃣ View Generated Results**

```powershell
# Quick verification of generated report
.\venv\Scripts\python.exe -c "
import json
with open('output/result_W001.json') as f:
    data = json.load(f)
    print(f'Worker: {data[\"worker_name\"]}')
    print(f'Platform: {data[\"platform\"]}')
    print(f'CREDIS Score: {data[\"credis_score\"]}/100')
    print(f'Risk Band: {data[\"risk_band\"]}')
    print(f'Max Loan: Rs.{data[\"max_loan\"]:,}')
    print(f'Approval: {data[\"approval_days\"]} day(s)')
"
```

---

## 📋 All Important Commands

| Command | Purpose |
|---------|---------|
| `python -m venv venv` | Create virtual environment |
| `.\venv\Scripts\Activate.ps1` | Activate environment |
| `pip install -r requirements.txt` | Install all dependencies |
| `python agents/agent6_growthcoach.py W001` | Run complete pipeline for worker W001 |
| `python -m streamlit run dashboard/app.py` | Launch web dashboard |
| `python -m streamlit run dashboard/app.py --logger.level=error` | Dashboard with error suppression |

---

## 📦 Dependencies

Core packages (54 total):
- **uagents** — ASI-1 AI agent framework
- **requests** — HTTP API calls
- **python-dotenv** — Environment variable management
- **streamlit** — Web dashboard framework
- **plotly** — Interactive charts & visualizations
- **google-genai** — Google Gemini API
- **fastapi, uvicorn** — REST API support
- **pandas, numpy** — Data processing

See `requirements.txt` for complete pinned versions.

---

## 🎯 Key Metrics & Scoring

### **CREDIS Score Calculation**

```
Base Score = (Income Stability × 0.30) +
             (Platform Reliability × 0.25) +
             (Work Consistency × 0.20) +
             (Spending Discipline × 0.15) +
             (Income Growth × 0.10)

Adjustments:
  + 5 points if CKYC verified
  - 10 points if CKYC not verified
  + 10 points if NBCFDC member
  - 5 points if NBCFDC lapsed

Final Score: Base Score + Adjustments (0-100 range)
```

### **Risk Band Classification**

- **≥ 75**: LOW_RISK_HIGH_NEED → APPROVE_FAST (1 day, Rs.300K)
- **≥ 60**: LOW_RISK_LOW_NEED → APPROVE_STANDARD (7 days, Rs.150K)
- **≥ 40**: HIGH_RISK_HIGH_NEED → APPROVE_CAPPED (14 days, Rs.50K)
- **< 40**: HIGH_RISK_LOW_NEED → COACHING_ONLY (N/A, Rs.0)

---

## 📊 Dashboard Features

### **Interactive Web Interface** (http://localhost:8502)

1. **🏆 Score Overview Section**
   - CREDIS Score (0-100) with color coding
   - Risk Band label (Low/High Risk × High/Low Need)
   - Loan Decision status (APPROVE_FAST/STANDARD/CAPPED, COACHING_ONLY)
   - Maximum loan amount in rupees

2. **📈 Signal Breakdown Section**
   - Interactive Plotly radar chart with 5 signals
   - Individual signal scores (0-100) displayed as text
   - Income Stability, Platform Reliability, Work Consistency, Spending Discipline, Income Growth

3. **🏦 Top 3 Lenders Section**
   - Purple gradient recommendation cards
   - Lender name, interest rate, max loan amount
   - Approval timeline in days

4. **📋 Growth Roadmap Section**
   - Expandable month-by-month plan
   - Income targets and action items
   - Milestone tracking

5. **📌 Detailed Metrics Section**
   - Monthly income, active months, platform rating
   - Cancellation rate, worker profile details
   - RD/Insurance status, CKYC verification, account balance

---

## 💾 Input & Output Formats

### **Input** (Worker Profile JSON)
Located in `User Details/{worker_id}.json`:
```json
{
  "worker_id": "W001",
  "name": "Ravi Kumar",
  "platform": "Swiggy",
  "monthly_earnings": 28000,
  "rating": 4.8,
  "has_rd": true,
  "rd_amount": 1000,
  "has_insurance": true,
  "insurance_premium": 500,
  "ckyc": true,
  "nbcfdc": "active",
  "current_balance": 45000,
  "earnings_12_months": [26000, 27000, 28000, ...]
}
```

### **Output** (CREDIS Report)
Saved as `output/result_{worker_id}.json` — Contains:
- Worker profile data
- All 6 agent outputs
- CREDIS Score & components
- Risk classification
- Top 3 lender recommendations
- 12-month growth roadmap
- Complete loan decision documentation

---

## 🔧 Configuration

### **config.py**
Central configuration file with:
- API endpoints
- Score thresholds
- Risk band boundaries
- Loan amount limits
- Approval timelines

### **lenders.json**
Database of available lenders with:
- Lender names
- Interest rates
- Minimum/maximum loan amounts
- Required CREDIS score minimums
- Approval timelines

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Virtual environment not activating | Use full path: `.\venv\Scripts\Activate.ps1` |
| API key not reading from .env | Check .env is in project root; verify no UTF-8 BOM |
| Streamlit command not found | Use: `python -m streamlit run dashboard/app.py` |
| Missing plotly module | Install: `pip install plotly` |
| Worker JSON file not found | Ensure file exists in `User Details/{worker_id}.json` |
| Dashboard KeyError | Verify `output/result_{worker_id}.json` exists and is valid JSON |

---

## 📝 Example Usage Session

```powershell
# 1. Activate environment
.\venv\Scripts\Activate.ps1

# 2. Process worker W001
python agents/agent6_growthcoach.py W001
# Output: Processing Agent 1-6... → Saved to output/result_W001.json

# 3. Launch dashboard
python -m streamlit run dashboard/app.py
# Output: Streamlit running on http://localhost:8502

# 4. Open browser → view complete CREDIS analysis
# - CREDIS Score: 98.8/100 ✓
# - Risk Band: Low Risk — High Need
# - Loan Decision: APPROVE_FAST (Rs.300,000 in 1 day)
# - Top Lenders: NBCFDC, PM SVANidhi, MUDRA Shishu
# - 12-Month Roadmap: Personalized growth plan
```

---

## 📧 Project Information

- **Purpose**: Behavioral credit scoring for India's gig economy
- **Target Users**: Microfinance lenders, loan officers
- **Platform Support**: Swiggy, Uber, Amazon Flex, etc.
- **Worker Database**: W001-W005 sample profiles
- **Technology Stack**: Python 3.13, ASI-1 AI, Streamlit, Plotly
- **API Integration**: ASI-1 validation + Google Gemini analysis

---

## ✅ Checklist for First Run

- [ ] Virtual environment created and activated
- [ ] `requirements.txt` installed
- [ ] `.env` file configured with API keys
- [ ] Worker JSON files in `User Details/` directory
- [ ] Run `python agents/agent6_growthcoach.py W001` successfully
- [ ] Check `output/result_W001.json` created
- [ ] Launch dashboard with `python -m streamlit run dashboard/app.py`
- [ ] View complete CREDIS report in browser

---

## 🎓 Learning Path

1. **Understand the flow**: Read agents in order (1-6)
2. **Examine input data**: Open `User Details/W001.json`
3. **Run single worker**: Execute `python agents/agent6_growthcoach.py W001`
4. **Review output**: Open `output/result_W001.json` in editor
5. **Explore dashboard**: View visualizations at http://localhost:8502
6. **Test all workers**: Process W002-W005
7. **Customize**: Modify scoring weights in `agent3_identityforge.py`

---

**Happy Lending! 🚀**
