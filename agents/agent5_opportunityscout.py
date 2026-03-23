"""
OpportunityScout Agent (Agent 5)
Matches workers with the best lenders from lenders.json based on CREDIS data.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1
from agents.agent4_riskguard import run_riskguard

# Load environment variables
load_dotenv()


def run_opportunityscout(worker_id):
    """
    Match worker with eligible lenders based on CREDIS profile.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Complete profile data with eligible lenders and recommendations
    """
    try:
        # Get risk data from RiskGuard
        print("\n[OpportunityScout] Calling RiskGuard to get risk profile...")
        risk_data = run_riskguard(worker_id)
        
        if not risk_data:
            print("Error: Failed to get risk data")
            return None
        
        # Load lenders database
        print("\n[OpportunityScout] Loading lenders database...")
        lenders_path = Path(__file__).parent.parent / "lenders.json"
        
        with open(lenders_path) as f:
            lenders_db = json.load(f)
        
        # Filter eligible lenders
        eligible = []
        for lender in lenders_db['lenders']:
            e = lender['eligibility']
            if risk_data['credis_score'] >= e['min_credis_score']:
                if risk_data['avg_monthly_income'] >= e['min_monthly_income']:
                    if risk_data['max_loan'] >= lender['loan_details']['min_amount']:
                        eligible.append(lender)
        
        print(f"[OpportunityScout] Found {len(eligible)} eligible lenders")
        
        # Build lender summary for ASI-1
        lender_text = ""
        for l in eligible:
            approval_time = l['process'].get('approval_time_days', 'N/A')
            lender_text += f"""
        Lender: {l['lender_name']}
        Type: {l['lender_type']}
        Max Loan: Rs.{l['loan_details']['max_amount']:,}
        Interest Rate: {l['loan_details']['interest_rate_percent']}%
        Approval Days: {approval_time}
        Min Score Required: {l['eligibility']['min_credis_score']}
        ---"""
        
        # Prepare lender matching prompt
        prompt = f"""You are OpportunityScout, Agent 5 of CREDIS system.

Worker: {risk_data['worker_name']}
CREDIS Score: {risk_data['credis_score']}/100
Risk Band: {risk_data['band_label']}
Average Monthly Income: Rs.{risk_data['avg_monthly_income']:,.0f}
Max Eligible Loan: Rs.{risk_data['max_loan']:,}

Eligible lenders found:{lender_text}

Rank these lenders from BEST to WORST for this worker.
Consider: interest rate, loan amount, approval speed, lender type.
Give top 3 recommendations with one reason each.
Format: 1. [Lender Name] - [Reason]"""
        
        # Send to ASI-1 for lender recommendations
        print("\n[OpportunityScout] Getting lender recommendations from ASI-1...")
        response = ask_asi1(prompt)
        
        if response:
            print(f"\n[ASI-1 Lender Recommendations]:\n{response}")
        else:
            print("[Warning] No lender recommendations from ASI-1")
        
        # Extract top 3 lenders
        top3_lenders = eligible[:3]
        
        # Build complete result dictionary
        result = {
            # All risk data fields
            'worker_id': risk_data['worker_id'],
            'worker_name': risk_data['worker_name'],
            'platform': risk_data['platform'],
            'avg_monthly_income': risk_data['avg_monthly_income'],
            'income_cv': risk_data['income_cv'],
            'growth_pct': risk_data['growth_pct'],
            'active_months': risk_data['active_months'],
            'rent_payments_count': risk_data['rent_payments_count'],
            'h1_avg': risk_data['h1_avg'],
            'h2_avg': risk_data['h2_avg'],
            'min_income': risk_data['min_income'],
            'max_income': risk_data['max_income'],
            'rating': risk_data['rating'],
            'cancellation_rate': risk_data['cancellation_rate'],
            'active_days_per_month': risk_data['active_days_per_month'],
            'has_rd': risk_data['has_rd'],
            'rd_amount': risk_data['rd_amount'],
            'rd_months_paid': risk_data['rd_months_paid'],
            'has_insurance': risk_data['has_insurance'],
            'insurance_premium': risk_data['insurance_premium'],
            'nbcfdc_history': risk_data['nbcfdc_history'],
            'ckyc': risk_data['ckyc'],
            'current_balance': risk_data['current_balance'],
            'bank_transactions': risk_data['bank_transactions'],
            'monthly_earnings': risk_data['monthly_earnings'],
            'credis_score': risk_data['credis_score'],
            's1': risk_data['s1'],
            's2': risk_data['s2'],
            's3': risk_data['s3'],
            's4': risk_data['s4'],
            's5': risk_data['s5'],
            'base_score': risk_data['base_score'],
            'ckyc_adj': risk_data['ckyc_adj'],
            'nbcfdc_adj': risk_data['nbcfdc_adj'],
            'score_breakdown': risk_data['score_breakdown'],
            'risk_band': risk_data['risk_band'],
            'loan_decision': risk_data['loan_decision'],
            'approval_days': risk_data['approval_days'],
            'max_loan': risk_data['max_loan'],
            'band_label': risk_data['band_label'],
            
            # Lender matching fields
            'eligible_lenders': eligible,
            'top3_lenders': top3_lenders,
            'total_eligible_count': len(eligible),
        }
        
        return result
        
    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON - {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("CREDIS - OpportunityScout Agent (Agent 5)")
    print("=" * 60)
    
    result = run_opportunityscout("W001")
    
    if result:
        print("\n" + "=" * 60)
        print("Lender Matching Complete!")
        print("=" * 60)
        print(f"Total eligible lenders: {result['total_eligible_count']}")
        
        if result['top3_lenders']:
            print(f"\nTop 3 Matched Lenders:")
            for i, l in enumerate(result['top3_lenders'], 1):
                print(f"{i}. {l['lender_name']} — {l['loan_details']['interest_rate_percent']}% — Rs.{l['loan_details']['max_amount']:,}")
        else:
            print("\nNo eligible lenders found")
        
        print("=" * 60)
