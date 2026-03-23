"""
PatternMind Agent (Agent 2)
Analyzes 12 months of worker data to identify behavioral patterns.
"""

import json
import os
import sys
import statistics
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1
from agents.agent1_dataweaver import run_dataweaver

# Load environment variables
load_dotenv()


def run_patternmind(worker_id):
    """
    Analyze worker behavioral patterns from 12 months of data.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Pattern analysis data with behavioral insights
    """
    try:
        # Get structured worker data from DataWeaver
        print("\n[PatternMind] Calling DataWeaver to load worker data...")
        worker_data = run_dataweaver(worker_id)
        
        if not worker_data:
            print("Error: Failed to load worker data")
            return None
        
        # Extract earnings list
        earnings_list = []
        if worker_data.get('monthly_earnings'):
            if isinstance(worker_data['monthly_earnings'], list):
                earnings_list = [item.get('amount', 0) if isinstance(item, dict) else item 
                                for item in worker_data['monthly_earnings']]
            elif isinstance(worker_data['monthly_earnings'], dict):
                earnings_list = list(worker_data['monthly_earnings'].values())
        
        # Calculate income statistics
        if len(earnings_list) >= 2:
            avg_monthly_income = statistics.mean(earnings_list)
            min_income = min(earnings_list)
            max_income = max(earnings_list)
            income_std_dev = statistics.stdev(earnings_list)
            income_cv = income_std_dev / avg_monthly_income if avg_monthly_income > 0 else 0
        else:
            avg_monthly_income = sum(earnings_list) if earnings_list else 0
            min_income = min(earnings_list) if earnings_list else 0
            max_income = max(earnings_list) if earnings_list else 0
            income_std_dev = 0
            income_cv = 0
        
        # Calculate H1 and H2 averages (6 months each)
        h1_earnings = earnings_list[:6] if len(earnings_list) >= 6 else earnings_list
        h2_earnings = earnings_list[6:12] if len(earnings_list) >= 12 else earnings_list[6:]
        
        h1_avg = statistics.mean(h1_earnings) if h1_earnings else 0
        h2_avg = statistics.mean(h2_earnings) if h2_earnings else 0
        growth_pct = ((h2_avg - h1_avg) / h1_avg * 100) if h1_avg > 0 else 0
        
        # Count active and low months
        active_months = sum(1 for amount in earnings_list if amount > 3000)
        low_months = sum(1 for amount in earnings_list if amount < 10000)
        
        # Count rent payments from bank transactions
        rent_payments_count = 0
        if worker_data.get('bank_transactions'):
            for transaction in worker_data['bank_transactions']:
                if isinstance(transaction, dict):
                    narration = transaction.get('narration', '').upper()
                    if 'RENT' in narration:
                        rent_payments_count += 1
        
        # Prepare comprehensive pattern analysis prompt
        prompt = f"""You are PatternMind, Agent 2 of CREDIS system.
Analyze these 12-month behavioral patterns for {worker_data['worker_name']}:

Monthly earnings: {earnings_list}
Average monthly income: Rs.{avg_monthly_income:.0f}
Income CV (volatility): {income_cv:.2f}
H1 average (Jan-Jun): Rs.{h1_avg:.0f}
H2 average (Jul-Dec): Rs.{h2_avg:.0f}
Income growth H1 to H2: {growth_pct:.1f}%
Active months (above Rs.3000): {active_months}/12
Rent payments found: {rent_payments_count}/12
Platform rating: {worker_data['rating']}
Cancellation rate: {worker_data['cancellation_rate']}
Has RD savings: {worker_data['has_rd']}
Has insurance: {worker_data['has_insurance']}

Give a 5-line behavioral pattern analysis.
Identify the worker's strongest and weakest signals."""
        
        # Send to ASI-1 for pattern analysis
        print("\n[PatternMind] Sending pattern analysis to ASI-1...")
        response = ask_asi1(prompt)
        
        if response:
            print(f"\n[ASI-1 Pattern Analysis]:\n{response}")
        else:
            print("[Warning] No pattern analysis from ASI-1, proceeding with calculated patterns")
        
        # Build pattern data dictionary
        pattern_data = {
            'worker_id': worker_data['worker_id'],
            'worker_name': worker_data['worker_name'],
            'platform': worker_data['platform'],
            'avg_monthly_income': avg_monthly_income,
            'income_cv': income_cv,
            'growth_pct': growth_pct,
            'active_months': active_months,
            'rent_payments_count': rent_payments_count,
            'h1_avg': h1_avg,
            'h2_avg': h2_avg,
            'min_income': min_income,
            'max_income': max_income,
            'rating': worker_data['rating'],
            'cancellation_rate': worker_data['cancellation_rate'],
            'active_days_per_month': worker_data['active_days_per_month'],
            'has_rd': worker_data['has_rd'],
            'rd_amount': worker_data['rd_amount'],
            'rd_months_paid': worker_data['rd_months_paid'],
            'has_insurance': worker_data['has_insurance'],
            'insurance_premium': worker_data['insurance_premium'],
            'nbcfdc_history': worker_data['nbcfdc_history'],
            'ckyc': worker_data['ckyc'],
            'current_balance': worker_data['current_balance'],
            'bank_transactions': worker_data['bank_transactions'],
            'monthly_earnings': worker_data['monthly_earnings'],
        }
        
        return pattern_data
        
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("CREDIS - PatternMind Agent (Agent 2)")
    print("=" * 60)
    
    result = run_patternmind("W001")
    
    if result:
        print("\n" + "=" * 60)
        print("Pattern Analysis Complete!")
        print("=" * 60)
        print(f"Avg Income: Rs.{result['avg_monthly_income']:,.0f}")
        print(f"Income CV: {result['income_cv']:.2f}")
        print(f"Growth: {result['growth_pct']:.1f}%")
        print(f"Active months: {result['active_months']}/12")
        print("=" * 60)
