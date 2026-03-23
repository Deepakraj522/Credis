"""
RiskGuard Agent (Agent 4)
Classifies workers into risk bands and provides loan decisions based on CREDIS Score.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1
from agents.agent3_identityforge import run_identityforge

# Load environment variables
load_dotenv()


def run_riskguard(worker_id):
    """
    Classify worker into risk band and provide loan decision.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Complete scoring and classification data with loan decision
    """
    try:
        # Get score data from IdentityForge
        print("\n[RiskGuard] Calling IdentityForge to get CREDIS Score...")
        score_data = run_identityforge(worker_id)
        
        if not score_data:
            print("Error: Failed to get score data")
            return None
        
        # Classify risk band based on CREDIS Score
        score = score_data['credis_score']
        
        if score >= 75:
            risk_band = "LOW_RISK_HIGH_NEED"
            loan_decision = "APPROVE_FAST"
            approval_days = 1
            max_loan = 300000
            band_label = "Low Risk — High Need"
        elif score >= 60:
            risk_band = "LOW_RISK_LOW_NEED"
            loan_decision = "APPROVE_STANDARD"
            approval_days = 7
            max_loan = 150000
            band_label = "Low Risk — Low Need"
        elif score >= 40:
            risk_band = "HIGH_RISK_HIGH_NEED"
            loan_decision = "APPROVE_CAPPED"
            approval_days = 14
            max_loan = 50000
            band_label = "High Risk — High Need"
        else:
            risk_band = "HIGH_RISK_LOW_NEED"
            loan_decision = "COACHING_ONLY"
            approval_days = None
            max_loan = 0
            band_label = "High Risk — Low Need"
        
        # Prepare risk assessment prompt
        prompt = f"""You are RiskGuard, Agent 4 of CREDIS system.

Worker: {score_data['worker_name']}
CREDIS Score: {score_data['credis_score']}/100
Risk Band: {band_label}
Loan Decision: {loan_decision}
Max Loan Eligible: Rs.{max_loan:,}
Approval Timeline: {approval_days if approval_days else 'N/A'} day(s)

Income Stability Score: {score_data['s1']}/100
Platform Reliability Score: {score_data['s2']:.1f}/100
Work Consistency Score: {score_data['s3']}/100
Spending Discipline Score: {score_data['s4']}/100
Income Growth Score: {score_data['s5']}/100

Write a 4-line risk assessment for this worker.
Include: risk level, key strengths, any concerns, 
and loan recommendation."""
        
        # Send to ASI-1 for risk assessment
        print("\n[RiskGuard] Sending risk assessment to ASI-1...")
        response = ask_asi1(prompt)
        
        if response:
            print(f"\n[ASI-1 Risk Assessment]:\n{response}")
        else:
            print("[Warning] No risk assessment from ASI-1")
        
        # Build complete result dictionary
        result = {
            # All score data fields
            'worker_id': score_data['worker_id'],
            'worker_name': score_data['worker_name'],
            'platform': score_data['platform'],
            'avg_monthly_income': score_data['avg_monthly_income'],
            'income_cv': score_data['income_cv'],
            'growth_pct': score_data['growth_pct'],
            'active_months': score_data['active_months'],
            'rent_payments_count': score_data['rent_payments_count'],
            'h1_avg': score_data['h1_avg'],
            'h2_avg': score_data['h2_avg'],
            'min_income': score_data['min_income'],
            'max_income': score_data['max_income'],
            'rating': score_data['rating'],
            'cancellation_rate': score_data['cancellation_rate'],
            'active_days_per_month': score_data['active_days_per_month'],
            'has_rd': score_data['has_rd'],
            'rd_amount': score_data['rd_amount'],
            'rd_months_paid': score_data['rd_months_paid'],
            'has_insurance': score_data['has_insurance'],
            'insurance_premium': score_data['insurance_premium'],
            'nbcfdc_history': score_data['nbcfdc_history'],
            'ckyc': score_data['ckyc'],
            'current_balance': score_data['current_balance'],
            'bank_transactions': score_data['bank_transactions'],
            'monthly_earnings': score_data['monthly_earnings'],
            'credis_score': score_data['credis_score'],
            's1': score_data['s1'],
            's2': score_data['s2'],
            's3': score_data['s3'],
            's4': score_data['s4'],
            's5': score_data['s5'],
            'base_score': score_data['base_score'],
            'ckyc_adj': score_data['ckyc_adj'],
            'nbcfdc_adj': score_data['nbcfdc_adj'],
            'score_breakdown': score_data['score_breakdown'],
            
            # Risk classification fields
            'risk_band': risk_band,
            'loan_decision': loan_decision,
            'approval_days': approval_days,
            'max_loan': max_loan,
            'band_label': band_label,
        }
        
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("CREDIS - RiskGuard Agent (Agent 4)")
    print("=" * 60)
    
    result = run_riskguard("W001")
    
    if result:
        print("\n" + "=" * 60)
        print("Risk Classification Complete!")
        print("=" * 60)
        print(f"CREDIS Score:  {result['credis_score']}/100")
        print(f"Risk Band:     {result['band_label']}")
        print(f"Loan Decision: {result['loan_decision']}")
        print(f"Max Loan:      Rs.{result['max_loan']:,}")
        if result['approval_days']:
            print(f"Approval:      {result['approval_days']} day(s)")
        else:
            print(f"Approval:      N/A (Coaching Only)")
        print("=" * 60)
