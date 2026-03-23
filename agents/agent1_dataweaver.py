"""
DataWeaver Agent (Agent 1)
Loads worker JSON files and structures the data cleanly for pattern analysis.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).parent.parent))
from shared.asi1_client import ask_asi1

# Load environment variables
load_dotenv()


def run_dataweaver(worker_id):
    """
    Load and structure worker data from JSON file.
    
    Args:
        worker_id (str): The worker ID (e.g., 'W001')
        
    Returns:
        dict: Structured worker data ready for pattern analysis
    """
    try:
        # Build file path
        file_path = Path(__file__).parent.parent / "User Details" / f"{worker_id}.json"
        
        # Load JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        # Extract and structure data
        deposit_account = raw_data.get('deposit_account', {})
        platform_data = raw_data.get('platform_data', {})
        recurring_deposit = raw_data.get('recurring_deposit')
        insurance_policy = raw_data.get('insurance_policy')
        nbcfdc_history = raw_data.get('nbcfdc_history')
        
        # Build clean worker data dictionary
        worker_data = {
            'worker_id': worker_id,
            'worker_name': deposit_account.get('profile', {}).get('name'),
            'platform': platform_data.get('platform'),
            'monthly_earnings': platform_data.get('monthly_earnings'),
            'rating': platform_data.get('rating'),
            'cancellation_rate': platform_data.get('cancellation_rate'),
            'active_days_per_month': platform_data.get('active_days_per_month'),
            'total_deliveries': platform_data.get('total_deliveries'),
            'bank_transactions': deposit_account.get('transactions', []),
            'has_rd': recurring_deposit is not None,
            'rd_amount': recurring_deposit.get('summary', {}).get('recurringAmount', 0) if recurring_deposit else 0,
            'rd_months_paid': len(recurring_deposit.get('transactions', [])) if recurring_deposit else 0,
            'has_insurance': insurance_policy is not None,
            'insurance_premium': insurance_policy.get('summary', {}).get('premiumAmount', 0) if insurance_policy else 0,
            'nbcfdc_history': nbcfdc_history,
            'ckyc': deposit_account.get('profile', {}).get('ckycCompliance'),
            'current_balance': deposit_account.get('summary', {}).get('currentBalance'),
        }
        
        # Prepare prompt for ASI-1
        prompt = f"""You are DataWeaver, Agent 1 of CREDIS system.
I have loaded worker data for {worker_data['worker_name']} (ID: {worker_id}).
Platform: {worker_data['platform']}
Total deliveries: {worker_data['total_deliveries']}
Rating: {worker_data['rating']}
Has RD: {worker_data['has_rd']}
Has Insurance: {worker_data['has_insurance']}
NBCFDC history: {worker_data['nbcfdc_history']}

Confirm this data is valid and ready for pattern analysis.
Reply in 2 lines only."""
        
        # Send to ASI-1 for validation
        print("\n[DataWeaver] Sending data validation to ASI-1...")
        response = ask_asi1(prompt)
        
        if response:
            print(f"\n[ASI-1 Confirmation]:\n{response}")
        else:
            print("[Warning] No confirmation from ASI-1, proceeding with data loaded")
        
        return worker_data
        
    except FileNotFoundError:
        print(f"Error: Worker file not found at {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in worker file")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("CREDIS - DataWeaver Agent (Agent 1)")
    print("=" * 60)
    
    result = run_dataweaver("W001")
    
    if result:
        print("\n" + "=" * 60)
        print("Data extracted successfully!")
        print("=" * 60)
        print(f"Worker: {result['worker_name']}")
        print(f"Platform: {result['platform']}")
        print(f"Transactions: {len(result['bank_transactions'])}")
        print(f"Has RD: {result['has_rd']}")
        print(f"Has Insurance: {result['has_insurance']}")
        print("=" * 60)
