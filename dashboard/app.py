"""
CREDIS Dashboard
Behavioral Credit Intelligence for India's Invisible Workforce
"""

import streamlit as st
import json
import os
import plotly.graph_objects as go
import plotly.express as px
import sys
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Page configuration
st.set_page_config(
    page_title="CREDIS — Behavioral Credit Intelligence",
    page_icon="💳",
    layout="wide"
)

# Custom CSS for styling
st.markdown("""
    <style>
    :root {
        --primary: #6C63FF;
        --success: #00C896;
        --warning: #FFB347;
        --dark: #1F1F1F;
        --light: #F5F5F5;
    }
    
    .main {
        background-color: #FAFAFA;
    }
    
    .metric-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-left: 4px solid #6C63FF;
    }
    
    .score-high {
        color: #00C896;
        font-weight: bold;
    }
    
    .score-medium {
        color: #FFB347;
        font-weight: bold;
    }
    
    .score-low {
        color: #FF6B6B;
        font-weight: bold;
    }
    
    .lender-card {
        background: linear-gradient(135deg, #6C63FF 0%, #8B7FFF 100%);
        color: white;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
    }
    
    .roadmap-section {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-top: 10px;
        border-left: 4px solid #6C63FF;
    }
    
    h1 {
        color: #1F1F1F;
        text-align: center;
        font-size: 3em;
        margin-bottom: 0;
        letter-spacing: 2px;
    }
    
    .tagline {
        text-align: center;
        color: #666;
        font-size: 1.1em;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    
    .powered-by {
        text-align: center;
        color: #999;
        font-size: 0.9em;
        margin-bottom: 30px;
        font-style: italic;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown("# 💳 CREDIS")
st.markdown('<div class="tagline">Behavioral Credit Intelligence for India\'s Invisible Workforce</div>', unsafe_allow_html=True)
st.markdown('<div class="powered-by">Powered by ASI-1 + Fetch.ai Agentverse</div>', unsafe_allow_html=True)

# Sidebar
st.sidebar.title("🔍 Select Worker")

# Worker selection
workers = ["W001", "W002", "W003", "W004", "W005"]
selected_worker = st.sidebar.selectbox("Choose a worker ID:", workers)

# Get worker directory
output_dir = Path(__file__).parent.parent / "output"
result_file = output_dir / f"result_{selected_worker}.json"

# Load button
if st.sidebar.button("🚀 Run CREDIS Analysis", use_container_width=True):
    st.session_state.run_analysis = True

# Check if result exists
if not result_file.exists():
    st.sidebar.warning(f"⚠️ No analysis found for {selected_worker}\nRun analysis from agents first")
    st.info("Please run the analysis first:\n```\npython agents/agent6_growthcoach.py " + selected_worker + "\n```")
else:
    # Load and display worker data
    with open(result_file) as f:
        data = json.load(f)
    
    # Show worker name in sidebar
    st.sidebar.success(f"✓ {data['worker_name']}")
    st.sidebar.markdown("---")
    
    # SECTION 1 — Score Overview (4 columns)
    st.markdown("### 📊 Score Overview")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        score = data['credis_score']
        score_class = "score-high" if score >= 75 else "score-medium" if score >= 50 else "score-low"
        st.metric(
            "CREDIS Score",
            f"{score}/100",
            delta=f"{'✓ Excellent' if score >= 75 else '⚠ Good' if score >= 50 else '✗ Low'}"
        )
    
    with col2:
        st.metric("Risk Band", data['band_label'])
    
    with col3:
        st.metric("Loan Decision", data['loan_decision'])
    
    with col4:
        st.metric("Max Loan", f"Rs.{data['max_loan']:,}")
    
    st.markdown("---")
    
    # SECTION 2 — Score Breakdown (Radar Chart)
    st.markdown("### 🎯 Signal Score Breakdown")
    
    breakdown = data['score_breakdown']
    
    # Create radar chart
    fig = go.Figure(data=go.Scatterpolar(
        r=[
            breakdown['income_stability'],
            breakdown['platform_reliability'],
            breakdown['work_consistency'],
            breakdown['spending_discipline'],
            breakdown['income_growth']
        ],
        theta=[
            'Income Stability',
            'Platform Reliability',
            'Work Consistency',
            'Spending Discipline',
            'Income Growth'
        ],
        fill='toself',
        name='Signal Scores',
        line_color='#6C63FF',
        fillcolor='rgba(108, 99, 255, 0.3)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100],
                tickfont=dict(size=10),
                gridcolor='#E0E0E0'
            ),
            bgcolor='rgba(240, 240, 250, 0.1)'
        ),
        showlegend=False,
        hovermode='closest',
        margin=dict(l=80, r=80, b=80, t=80),
        height=500
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Signal details in a table
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.markdown(f"<div style='text-align:center'><div style='font-size:2em; color:#6C63FF'>{breakdown['income_stability']}</div><div style='color:#666; font-size:0.85em'>Income<br>Stability</div></div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"<div style='text-align:center'><div style='font-size:2em; color:#6C63FF'>{breakdown['platform_reliability']:.0f}</div><div style='color:#666; font-size:0.85em'>Platform<br>Reliability</div></div>", unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"<div style='text-align:center'><div style='font-size:2em; color:#6C63FF'>{breakdown['work_consistency']}</div><div style='color:#666; font-size:0.85em'>Work<br>Consistency</div></div>", unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"<div style='text-align:center'><div style='font-size:2em; color:#6C63FF'>{breakdown['spending_discipline']}</div><div style='color:#666; font-size:0.85em'>Spending<br>Discipline</div></div>", unsafe_allow_html=True)
    
    with col5:
        st.markdown(f"<div style='text-align:center'><div style='font-size:2em; color:#6C63FF'>{breakdown['income_growth']}</div><div style='color:#666; font-size:0.85em'>Income<br>Growth</div></div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # SECTION 3 — Top 3 Lenders
    st.markdown("### 🏦 Top 3 Recommended Lenders")
    
    col1, col2, col3 = st.columns(3)
    
    for idx, (col, lender) in enumerate(zip([col1, col2, col3], data['top3_lenders'])):
        with col:
            st.markdown(f"""
            <div class="lender-card">
                <h3 style='margin-top:0'>{idx+1}. {lender['lender_name']}</h3>
                <div style='font-size:2em; margin:10px 0'>{lender['loan_details']['interest_rate_percent']}%</div>
                <div style='font-size:0.9em; margin-bottom:10px'>Interest Rate</div>
                <hr style='border:1px solid rgba(255,255,255,0.3); margin:10px 0'>
                <div style='font-size:1.2em; font-weight:bold; margin:10px 0'>Rs.{lender['loan_details']['max_amount']:,}</div>
                <div style='font-size:0.9em; margin-bottom:10px'>Max Loan</div>
                <div style='font-size:1em; margin:10px 0'>⏱️ {lender['process']['approval_time_days']} days</div>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # SECTION 4 — Growth Roadmap
    st.markdown("### 📈 12-Month Growth Roadmap")
    
    with st.expander("📋 Click to view your personalized growth roadmap", expanded=False):
        st.markdown(data['growth_roadmap'])
    
    st.markdown("---")
    
    # Additional Metrics
    st.markdown("### 📌 Detailed Metrics")
    
    metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
    
    with metric_col1:
        st.metric("Monthly Income", f"Rs.{data['avg_monthly_income']:,.0f}")
    
    with metric_col2:
        st.metric("Active Months", f"{data['additional_metrics']['active_months']}/12")
    
    with metric_col3:
        st.metric("Platform Rating", f"{data['additional_metrics']['rating']:.1f}⭐")
    
    with metric_col4:
        st.metric("Cancellation Rate", f"{data['additional_metrics']['cancellation_rate']*100:.1f}%")
    
    # More details
    st.markdown("#### Worker Profile")
    
    profile_col1, profile_col2, profile_col3, profile_col4 = st.columns(4)
    
    with profile_col1:
        st.markdown(f"**Platform**: {data['platform']}")
        st.markdown(f"**Growth**: {data['additional_metrics']['growth_pct']:.1f}%")
    
    with profile_col2:
        st.markdown(f"**Has RD**: {'✓ Yes' if data['additional_metrics']['has_rd'] else '✗ No'}")
        if data['additional_metrics']['has_rd']:
            st.markdown(f"**RD Amount**: Rs.{data['additional_metrics']['rd_amount']}/month")
    
    with profile_col3:
        st.markdown(f"**Has Insurance**: {'✓ Yes' if data['additional_metrics']['has_insurance'] else '✗ No'}")
        if data['additional_metrics']['has_insurance']:
            st.markdown(f"**Premium**: Rs.{data['additional_metrics']['insurance_premium']}")
    
    with profile_col4:
        st.markdown(f"**CKYC**: {'✓ Yes' if data['additional_metrics']['ckyc'] else '✗ No'}")
        st.markdown(f"**Balance**: Rs.{data['additional_metrics']['current_balance']:,.0f}")
    
    st.markdown("---")
    
    # Footer
    st.markdown("""
    <div style='text-align:center; color:#999; font-size:0.9em; margin-top:30px'>
        <p>🤖 Powered by ASI-1 AI Agent + Fetch.ai Agentverse</p>
        <p>Generated: March 21, 2026 • CREDIS © 2026</p>
    </div>
    """, unsafe_allow_html=True)
