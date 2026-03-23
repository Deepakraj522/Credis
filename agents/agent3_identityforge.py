"""
IdentityForge Agent (Agent 3)
Calculates the CREDIS Score (0-100) for worker credibility assessment.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1
from agents.agent2_patternmind import run_patternmind
import config

# Load environment variables
load_dotenv()


def run_identityforge(worker_id):
    """
    Calculate CREDIS Score and credibility assessment for a worker.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Complete scoring data with CREDIS Score and all signal scores
    """
    try:
        # Get pattern data from PatternMind
        print("\n[IdentityForge] Calling PatternMind to analyze patterns...")
        pattern_data = run_patternmind(worker_id)
        
        if not pattern_data:
            print("Error: Failed to get pattern data")
            return None
        
        # SIGNAL 1 - Income Stability (weight 0.30)
        cv = pattern_data['income_cv']
        if cv < 0.10:
            s1 = 100
        elif cv < 0.20:
            s1 = 80
        elif cv < 0.30:
            s1 = 60
        elif cv < 0.50:
            s1 = 35
        else:
            s1 = 10
        
        # SIGNAL 2 - Platform Reliability (weight 0.25)
        rating = pattern_data['rating']
        if rating >= 4.8:
            r_score = 100
        elif rating >= 4.5:
            r_score = 80
        elif rating >= 4.0:
            r_score = 60
        elif rating >= 3.5:
            r_score = 35
        else:
            r_score = 10
        
        cancel = pattern_data['cancellation_rate']
        if cancel <= 0.02:
            c_score = 100
        elif cancel <= 0.05:
            c_score = 80
        elif cancel <= 0.08:
            c_score = 60
        elif cancel <= 0.12:
            c_score = 35
        else:
            c_score = 10
        
        days = pattern_data['active_days_per_month']
        if days >= 25:
            d_score = 100
        elif days >= 20:
            d_score = 80
        elif days >= 15:
            d_score = 60
        elif days >= 10:
            d_score = 35
        else:
            d_score = 10
        
        s2 = (r_score * 0.40) + (c_score * 0.35) + (d_score * 0.25)
        
        # SIGNAL 3 - Work Consistency (weight 0.20)
        active = pattern_data['active_months']
        if active == 12:
            s3 = 100
        elif active >= 10:
            s3 = 80
        elif active >= 8:
            s3 = 60
        elif active >= 6:
            s3 = 35
        else:
            s3 = 10
        
        # SIGNAL 4 - Spending Discipline (weight 0.15)
        rent = pattern_data['rent_payments_count']
        if rent >= 12:
            base = 100
        elif rent >= 10:
            base = 75
        elif rent >= 8:
            base = 50
        else:
            base = 20
        
        rd_bonus = 15 if pattern_data['has_rd'] else 0
        ins_bonus = 10 if pattern_data['has_insurance'] else 0
        s4 = min(100, base + rd_bonus + ins_bonus)
        
        # SIGNAL 5 - Income Growth (weight 0.10)
        growth = pattern_data['growth_pct']
        if growth >= 10:
            s5 = 100
        elif growth >= 5:
            s5 = 80
        elif growth >= 0:
            s5 = 60
        elif growth >= -10:
            s5 = 35
        else:
            s5 = 10
        
        # Calculate weighted base score
        base_score = (s1 * 0.30) + (s2 * 0.25) + (s3 * 0.20) + (s4 * 0.15) + (s5 * 0.10)
        
        # Apply adjustments
        ckyc_adj = 5 if pattern_data['ckyc'] else -10
        
        nbcfdc = pattern_data['nbcfdc_history']
        if nbcfdc is None:
            nbcfdc_adj = 0
        elif nbcfdc.get('repayment_status') == 'COMPLETED' and nbcfdc.get('late_payments') == 0:
            nbcfdc_adj = 10
        elif nbcfdc.get('repayment_status') == 'COMPLETED':
            nbcfdc_adj = 5
        elif nbcfdc.get('repayment_status') == 'ONGOING' and nbcfdc.get('missed_payments') == 0:
            nbcfdc_adj = 3
        else:
            nbcfdc_adj = -5
        
        # Calculate final CREDIS Score
        credis_score = round(min(100, max(0, base_score + ckyc_adj + nbcfdc_adj)), 1)
        
        # Prepare scoring explanation prompt
        prompt = f"""You are IdentityForge, Agent 3 of CREDIS system.
I have calculated the CREDIS Score for {pattern_data['worker_name']}.

Signal Scores:
- Income Stability (30%): {s1}/100
- Platform Reliability (25%): {s2:.1f}/100
- Work Consistency (20%): {s3}/100
- Spending Discipline (15%): {s4}/100
- Income Growth (10%): {s5}/100

Base Score: {base_score:.1f}
CKYC Adjustment: {ckyc_adj}
NBCFDC Adjustment: {nbcfdc_adj}

FINAL CREDIS SCORE: {credis_score}/100

Write a 3-line explanation of this score for a loan officer."""
        
        # Send to ASI-1 for explanation
        print("\n[IdentityForge] Sending score explanation to ASI-1...")
        response = ask_asi1(prompt)
        
        if response:
            print(f"\n[ASI-1 Loan Officer Brief]:\n{response}")
        else:
            print("[Warning] No explanation from ASI-1")
        
        # Build score breakdown
        score_breakdown = {
            'income_stability': {'score': s1, 'weight': 0.30},
            'platform_reliability': {'score': s2, 'weight': 0.25},
            'work_consistency': {'score': s3, 'weight': 0.20},
            'spending_discipline': {'score': s4, 'weight': 0.15},
            'income_growth': {'score': s5, 'weight': 0.10},
        }
        
        # Build complete result dictionary
        result = {
            # Pattern data (from PatternMind)
            'worker_id': pattern_data['worker_id'],
            'worker_name': pattern_data['worker_name'],
            'platform': pattern_data['platform'],
            'avg_monthly_income': pattern_data['avg_monthly_income'],
            'income_cv': pattern_data['income_cv'],
            'growth_pct': pattern_data['growth_pct'],
            'active_months': pattern_data['active_months'],
            'rent_payments_count': pattern_data['rent_payments_count'],
            'h1_avg': pattern_data['h1_avg'],
            'h2_avg': pattern_data['h2_avg'],
            'min_income': pattern_data['min_income'],
            'max_income': pattern_data['max_income'],
            'rating': pattern_data['rating'],
            'cancellation_rate': pattern_data['cancellation_rate'],
            'active_days_per_month': pattern_data['active_days_per_month'],
            'has_rd': pattern_data['has_rd'],
            'rd_amount': pattern_data['rd_amount'],
            'rd_months_paid': pattern_data['rd_months_paid'],
            'has_insurance': pattern_data['has_insurance'],
            'insurance_premium': pattern_data['insurance_premium'],
            'nbcfdc_history': pattern_data['nbcfdc_history'],
            'ckyc': pattern_data['ckyc'],
            'current_balance': pattern_data['current_balance'],
            'bank_transactions': pattern_data['bank_transactions'],
            'monthly_earnings': pattern_data['monthly_earnings'],
            
            # Score data (from IdentityForge)
            'credis_score': credis_score,
            's1': s1,
            's2': s2,
            's3': s3,
            's4': s4,
            's5': s5,
            'base_score': base_score,
            'ckyc_adj': ckyc_adj,
            'nbcfdc_adj': nbcfdc_adj,
            'score_breakdown': score_breakdown,
        }
        
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("CREDIS - IdentityForge Agent (Agent 3)")
    print("=" * 60)
    
    result = run_identityforge("W001")
    
    if result:
        print("\n" + "=" * 60)
        print("CREDIS Score Calculation Complete!")
        print("=" * 60)
        print(f"\nCREDIS Score: {result['credis_score']}/100")
        print(f"Signal 1 - Income Stability:     {result['s1']}/100")
        print(f"Signal 2 - Platform Reliability: {result['s2']:.1f}/100")
        print(f"Signal 3 - Work Consistency:     {result['s3']}/100")
        print(f"Signal 4 - Spending Discipline:  {result['s4']}/100")
        print(f"Signal 5 - Income Growth:        {result['s5']}/100")
        print("=" * 60)
