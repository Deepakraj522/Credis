"""
Test script for CREDIS API clients
Tests both ASI1 and Gemini API integrations
"""

from shared.asi1_client import ask_asi1
from shared.gemini_client import ask_gemini


def main():
    """Test both API clients"""
    
    print("=" * 60)
    print("CREDIS API Client Test")
    print("=" * 60)
    print()
    
    # Test ASI1
    print("Testing ASI1 API...")
    print("-" * 40)
    asi1_response = ask_asi1("Say hello from CREDIS project in one sentence")
    
    if asi1_response:
        print(f"✓ ASI1 Response: {asi1_response}")
        asi1_success = True
    else:
        print("✗ ASI1 API failed")
        asi1_success = False
    
    print()
    
    # Test Gemini
    print("Testing Gemini API...")
    print("-" * 40)
    gemini_response = ask_gemini("Say hello from CREDIS project in one sentence")
    
    if gemini_response:
        print(f"✓ Gemini Response: {gemini_response}")
        gemini_success = True
    else:
        print("✗ Gemini API failed")
        gemini_success = False
    
    print()
    print("=" * 60)
    
    # Final status
    if asi1_success and gemini_success:
        print("✓ Both APIs working! CREDIS is ready to build!")
    elif asi1_success:
        print("⚠ ASI1 working, but Gemini failed")
    elif gemini_success:
        print("⚠ Gemini working, but ASI1 failed")
    else:
        print("✗ Both APIs failed")
    
    print("=" * 60)


if __name__ == "__main__":
    main()
