# ============================================================
#   CREDIS — Behavioral Credit Intelligence System
#   config.py — Master Configuration File
#   All agents import from this file
# ============================================================

# ------------------------------------------------------------
# PROJECT INFO
# ------------------------------------------------------------
PROJECT_NAME        = "CREDIS"
PROJECT_VERSION     = "1.0.0"
SCORE_NAME          = "CREDIS Score"
SCORE_RANGE_MIN     = 0
SCORE_RANGE_MAX     = 100

# ------------------------------------------------------------
# DATA PATHS
# ------------------------------------------------------------
USER_DATA_PATH      = "User Details/"
LENDERS_PATH        = "lenders.json"
OUTPUT_PATH         = "output/"

# ------------------------------------------------------------
# ASI-1 API CONFIG
# ------------------------------------------------------------
ASI1_API_URL        = "https://api.asi1.ai/v1/chat/completions"
ASI1_MODEL          = "asi1-mini"
ASI1_MAX_TOKENS     = 1000
ASI1_TEMPERATURE    = 0.3        # low = more consistent scoring

# ------------------------------------------------------------
# CREDIS SCORE — 5 SIGNAL WEIGHTS (must sum to 1.0)
# ------------------------------------------------------------
SCORE_WEIGHTS = {
    "income_stability":     0.30,   # How stable is monthly income?
    "platform_reliability": 0.25,   # Rating, cancellation, active days
    "work_consistency":     0.20,   # Worked without gaps across 12 months?
    "spending_discipline":  0.15,   # Rent on time, RD, insurance paid?
    "income_growth_trend":  0.10    # Is income growing Jan → Dec?
}

# ------------------------------------------------------------
# SIGNAL SCORING RULES — Income Stability (Weight: 30%)
# Measures how consistent monthly income is across 12 months
# ------------------------------------------------------------
INCOME_STABILITY = {
    "excellent":    {"min_cv": 0.00, "max_cv": 0.10, "score": 100},  # CV < 10%
    "good":         {"min_cv": 0.10, "max_cv": 0.20, "score": 80},   # CV 10-20%
    "average":      {"min_cv": 0.20, "max_cv": 0.30, "score": 60},   # CV 20-30%
    "poor":         {"min_cv": 0.30, "max_cv": 0.50, "score": 35},   # CV 30-50%
    "very_poor":    {"min_cv": 0.50, "max_cv": 9.99, "score": 10}    # CV > 50%
}
# CV = Coefficient of Variation (std_dev / mean) — lower is better

# ------------------------------------------------------------
# SIGNAL SCORING RULES — Platform Reliability (Weight: 25%)
# Measures platform rating, cancellation rate, active days
# ------------------------------------------------------------
PLATFORM_RATING_SCORE = {
    "excellent":  {"min": 4.8, "max": 5.0, "score": 100},
    "good":       {"min": 4.5, "max": 4.8, "score": 80},
    "average":    {"min": 4.0, "max": 4.5, "score": 60},
    "poor":       {"min": 3.5, "max": 4.0, "score": 35},
    "very_poor":  {"min": 0.0, "max": 3.5, "score": 10}
}

CANCELLATION_RATE_SCORE = {
    "excellent":  {"max_rate": 0.02, "score": 100},   # < 2%
    "good":       {"max_rate": 0.05, "score": 80},    # 2-5%
    "average":    {"max_rate": 0.08, "score": 60},    # 5-8%
    "poor":       {"max_rate": 0.12, "score": 35},    # 8-12%
    "very_poor":  {"max_rate": 1.00, "score": 10}     # > 12%
}

ACTIVE_DAYS_SCORE = {
    "excellent":  {"min_days": 25, "score": 100},     # 25+ days/month
    "good":       {"min_days": 20, "score": 80},      # 20-25 days
    "average":    {"min_days": 15, "score": 60},      # 15-20 days
    "poor":       {"min_days": 10, "score": 35},      # 10-15 days
    "very_poor":  {"min_days": 0,  "score": 10}       # < 10 days
}

# Platform reliability = avg of 3 sub-scores
PLATFORM_RELIABILITY_WEIGHTS = {
    "rating":            0.40,
    "cancellation_rate": 0.35,
    "active_days":       0.25
}

# ------------------------------------------------------------
# SIGNAL SCORING RULES — Work Consistency (Weight: 20%)
# Checks how many months had income > minimum threshold
# ------------------------------------------------------------
WORK_CONSISTENCY = {
    "min_income_threshold": 3000,     # month is "active" if income > Rs.3000
    "scoring": {
        "excellent":  {"min_active_months": 12, "score": 100},  # all 12 months
        "good":       {"min_active_months": 10, "score": 80},   # 10-11 months
        "average":    {"min_active_months": 8,  "score": 60},   # 8-9 months
        "poor":       {"min_active_months": 6,  "score": 35},   # 6-7 months
        "very_poor":  {"min_active_months": 0,  "score": 10}    # < 6 months
    }
}

# ------------------------------------------------------------
# SIGNAL SCORING RULES — Spending Discipline (Weight: 15%)
# Checks rent payments, RD installments, insurance premiums
# ------------------------------------------------------------
SPENDING_DISCIPLINE = {
    "rent_payment_score": {
        "all_12_paid":    100,
        "10_to_11_paid":  75,
        "8_to_9_paid":    50,
        "below_8_paid":   20
    },
    "rd_bonus":           15,    # bonus if RD exists and all paid
    "insurance_bonus":    10,    # bonus if insurance premium paid
    "no_rd_no_insurance": 0,     # no bonus, base rent score only
    "max_score":          100
}

# ------------------------------------------------------------
# SIGNAL SCORING RULES — Income Growth Trend (Weight: 10%)
# Compares H2 avg (Jul-Dec) vs H1 avg (Jan-Jun)
# ------------------------------------------------------------
INCOME_GROWTH_TREND = {
    "strong_growth":   {"min_growth_pct": 10,  "score": 100},  # > 10% growth
    "moderate_growth": {"min_growth_pct": 5,   "score": 80},   # 5-10% growth
    "stable":          {"min_growth_pct": 0,   "score": 60},   # 0-5% growth
    "slight_decline":  {"min_growth_pct": -10, "score": 35},   # 0 to -10%
    "sharp_decline":   {"min_growth_pct": -99, "score": 10}    # > -10% decline
}

# ------------------------------------------------------------
# CREDIS SCORE — RISK BANDS
# ------------------------------------------------------------
RISK_BANDS = {
    "low_risk_high_need": {
        "min_score":        75,
        "max_score":        100,
        "label":            "Low Risk — High Need",
        "loan_decision":    "APPROVE_FAST",
        "approval_days":    1,
        "max_loan_amount":  300000,
        "description":      "Strong profile. Same-day sanction eligible."
    },
    "low_risk_low_need": {
        "min_score":        60,
        "max_score":        74,
        "label":            "Low Risk — Low Need",
        "loan_decision":    "APPROVE_STANDARD",
        "approval_days":    7,
        "max_loan_amount":  150000,
        "description":      "Good profile. Standard loan terms apply."
    },
    "high_risk_high_need": {
        "min_score":        40,
        "max_score":        59,
        "label":            "High Risk — High Need",
        "loan_decision":    "APPROVE_CAPPED",
        "approval_days":    14,
        "max_loan_amount":  50000,
        "description":      "Moderate profile. Capped loan + coaching recommended."
    },
    "high_risk_low_need": {
        "min_score":        0,
        "max_score":        39,
        "label":            "High Risk — Low Need",
        "loan_decision":    "COACHING_ONLY",
        "approval_days":    None,
        "max_loan_amount":  0,
        "description":      "Weak profile. Financial coaching required before loan."
    }
}

# ------------------------------------------------------------
# MISSING DATA FALLBACK RULES
# If a field is missing, use these default penalty scores
# ------------------------------------------------------------
MISSING_DATA_FALLBACK = {
    "no_recurring_deposit":   0,     # no RD bonus
    "no_insurance_policy":    0,     # no insurance bonus
    "no_nbcfdc_history":      50,    # neutral — not penalized, not rewarded
    "no_platform_rating":     40,    # assume average
    "no_ckyc":               -10,    # penalty applied to final score
    "incomplete_months":      35     # if < 6 months data available
}

# ------------------------------------------------------------
# CKYC COMPLIANCE IMPACT
# ------------------------------------------------------------
CKYC_BONUS       =  5    # bonus added to final CREDIS Score
CKYC_PENALTY     = -10   # penalty if ckycCompliance = False

# ------------------------------------------------------------
# NBCFDC HISTORY IMPACT ON FINAL SCORE
# ------------------------------------------------------------
NBCFDC_IMPACT = {
    "completed_zero_late":    10,    # perfect repayment bonus
    "completed_some_late":     5,    # completed but had late payments
    "ongoing_on_track":        3,    # current loan, paying on time
    "ongoing_with_late":      -5,    # current loan, some late payments
    "missed_payments":        -15,   # serious penalty
    "no_history":              0     # neutral
}

# ------------------------------------------------------------
# MINIMUM DATA REQUIREMENTS FOR SCORING
# ------------------------------------------------------------
MIN_DATA_REQUIREMENTS = {
    "min_months_required":        6,     # need at least 6 months of data
    "min_transactions_required":  10,    # need at least 10 bank transactions
    "min_platform_data":          True   # platform_data must exist
}

# ------------------------------------------------------------
# AGENT NAMES (for logging and Agentverse registration)
# ------------------------------------------------------------
AGENTS = {
    "agent1": "DataWeaver",
    "agent2": "PatternMind",
    "agent3": "IdentityForge",
    "agent4": "RiskGuard",
    "agent5": "OpportunityScout",
    "agent6": "GrowthCoach"
}

# ------------------------------------------------------------
# OUTPUT STRUCTURE (what each agent writes to output/)
# ------------------------------------------------------------
OUTPUT_KEYS = {
    "worker_id":        str,
    "worker_name":      str,
    "credis_score":     float,
    "risk_band":        str,
    "loan_decision":    str,
    "matched_lenders":  list,
    "growth_roadmap":   dict,
    "score_breakdown":  dict,
    "generated_at":     str
}