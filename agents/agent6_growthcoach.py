"""
GrowthCoach Agent (Agent 6)
Generates a personalized 12-month financial growth roadmap for workers.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1
from agents.agent5_opportunityscout import run_opportunityscout

# Load environment variables
load_dotenv()


def run_growthcoach(worker_id):
    """
    Generate personalized 12-month financial growth roadmap.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Complete CREDIS report with growth roadmap
    """
    try:
        # Get complete data from OpportunityScout
        print("\n[GrowthCoach] Calling OpportunityScout to get complete profile...")
        opportunity_data = run_opportunityscout(worker_id)
        
        if not opportunity_data:
            print("Error: Failed to get opportunity data")
            return None
        
        # Extract key data
        worker_name = opportunity_data['worker_name']
        platform = opportunity_data['platform']
        credis_score = opportunity_data['credis_score']
        band_label = opportunity_data['band_label']
        avg_monthly_income = opportunity_data['avg_monthly_income']
        growth_pct = opportunity_data['growth_pct']
        has_rd = opportunity_data['has_rd']
        rd_amount = opportunity_data['rd_amount']
        has_insurance = opportunity_data['has_insurance']
        max_loan = opportunity_data['max_loan']
        top3_lenders = opportunity_data['top3_lenders']
        
        # Prepare growth roadmap prompt
        prompt = f"""You are GrowthCoach, Agent 6 of CREDIS system.

Worker Profile:
Name: {worker_name}
Platform: {platform}
CREDIS Score: {credis_score}/100
Risk Band: {band_label}
Average Monthly Income: Rs.{avg_monthly_income:,.0f}
Has RD: {has_rd} (Rs.{rd_amount}/month)
Has Insurance: {has_insurance}
Income Growth: {growth_pct:.1f}%
Top Lender Match: {top3_lenders[0]['lender_name']}
Recommended Loan: Rs.{max_loan:,} at {top3_lenders[0]['loan_details']['interest_rate_percent']}%

Create a personalized 12-month financial growth roadmap.

Format it as:

MONTHS 1-3 (Foundation):
- Action 1
- Action 2
- Action 3

MONTHS 4-6 (Growth):
- Action 1
- Action 2
- Action 3

MONTHS 7-9 (Expansion):
- Action 1
- Action 2
- Action 3

MONTHS 10-12 (Consolidation):
- Action 1
- Action 2
- Action 3

YEAR END TARGET:
- Expected income
- Savings target
- CREDIS Score target"""
        
        # Send to ASI-1 for growth roadmap
        print("\n[GrowthCoach] Generating personalized growth roadmap...")
        roadmap = ask_asi1(prompt)
        
        if roadmap:
            print(f"\n[ASI-1 Growth Roadmap]:\n{roadmap}")
        else:
            print("[Warning] Could not generate growth roadmap")
            roadmap = "Unable to generate roadmap"
        
        # Build comprehensive final result
        final_result = {
            'worker_id': worker_id,
            'worker_name': worker_name,
            'platform': platform,
            'credis_score': credis_score,
            'risk_band': opportunity_data['risk_band'],
            'band_label': band_label,
            'loan_decision': opportunity_data['loan_decision'],
            'max_loan': max_loan,
            'approval_days': opportunity_data['approval_days'],
            'avg_monthly_income': avg_monthly_income,
            'top3_lenders': top3_lenders,
            'total_eligible_lenders': opportunity_data['total_eligible_count'],
            'score_breakdown': {
                'income_stability': opportunity_data['s1'],
                'platform_reliability': round(opportunity_data['s2'], 1),
                'work_consistency': opportunity_data['s3'],
                'spending_discipline': opportunity_data['s4'],
                'income_growth': opportunity_data['s5']
            },
            'growth_roadmap': roadmap,
            'additional_metrics': {
                'income_cv': opportunity_data['income_cv'],
                'growth_pct': opportunity_data['growth_pct'],
                'active_months': opportunity_data['active_months'],
                'rent_payments_count': opportunity_data['rent_payments_count'],
                'h1_avg': opportunity_data['h1_avg'],
                'h2_avg': opportunity_data['h2_avg'],
                'min_income': opportunity_data['min_income'],
                'max_income': opportunity_data['max_income'],
                'rating': opportunity_data['rating'],
                'cancellation_rate': opportunity_data['cancellation_rate'],
                'active_days_per_month': opportunity_data['active_days_per_month'],
                'has_rd': has_rd,
                'rd_amount': rd_amount,
                'rd_months_paid': opportunity_data['rd_months_paid'],
                'has_insurance': has_insurance,
                'insurance_premium': opportunity_data['insurance_premium'],
                'ckyc': opportunity_data['ckyc'],
                'current_balance': opportunity_data['current_balance'],
                'nbcfdc_history': opportunity_data['nbcfdc_history'],
            }
        }
        
        # Save result to output folder
        print("\n[GrowthCoach] Saving complete CREDIS report...")
        os.makedirs('output', exist_ok=True)
        
        output_file = Path('output') / f'result_{worker_id}.json'
        with open(output_file, 'w') as f:
            json.dump(final_result, f, indent=2)
        
        print(f"✓ Result saved to {output_file}")
        
        return final_result
        
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    # Accept worker_id from command line
    worker = sys.argv[1] if len(sys.argv) > 1 else "W001"
    
    print("=" * 60)
    print("CREDIS - GrowthCoach Agent (Agent 6)")
    print("=" * 60)
    
    result = run_growthcoach(worker)
    
    if result:
        print("\n" + "=" * 60)
        print("CREDIS COMPLETE RESULT")
        print("=" * 60)
        print(f"Worker:        {result['worker_name']}")
        print(f"Platform:      {result['platform']}")
        print(f"CREDIS Score:  {result['credis_score']}/100")
        print(f"Risk Band:     {result['band_label']}")
        print(f"Loan Decision: {result['loan_decision']}")
        print(f"Max Loan:      Rs.{result['max_loan']:,}")
        print(f"Approval:      {result['approval_days']} day(s)")
        
        print(f"\nTop 3 Lenders:")
        for i, l in enumerate(result['top3_lenders'], 1):
            print(f"  {i}. {l['lender_name']} — {l['loan_details']['interest_rate_percent']}% — Rs.{l['loan_details']['max_amount']:,}")
        
        print(f"\nScore Breakdown:")
        for k, v in result['score_breakdown'].items():
            formatted_key = k.replace('_', ' ').title()
            print(f"  {formatted_key}: {v}/100")
        
        print("=" * 60)
        print("ALL 6 AGENTS COMPLETED SUCCESSFULLY!")
        print("=" * 60)
