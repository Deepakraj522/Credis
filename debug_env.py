from pathlib import Path
from dotenv import load_dotenv
import os

# Test from root
print("=" * 50)
print("Test 1: Loading from current directory (.)")
env_path = Path(".env")
print(f"Path: {env_path}")
print(f"Exists: {env_path.exists()}")
print(f"Absolute: {env_path.absolute()}")
load_dotenv(env_path)
asi1 = os.getenv("ASI1_API_KEY")
gemini = os.getenv("GEMINI_API_KEY")
print(f"ASI1_API_KEY: {asi1[:20] if asi1 else 'NOT FOUND'}...")
print(f"GEMINI_API_KEY: {gemini[:20] if gemini else 'NOT FOUND'}...")

# Test from shared subfolder
print("\n" + "=" * 50)
print("Test 2: Loading from shared subfolder (..)\.env")
os.environ.clear()  # Clear previous
env_path2 = Path(__file__).parent.parent / ".env"
print(f"Path: {env_path2}")
print(f"Exists: {env_path2.exists()}")
print(f"Absolute: {env_path2.absolute()}")
load_dotenv(env_path2)
asi1 = os.getenv("ASI1_API_KEY")
gemini = os.getenv("GEMINI_API_KEY")
print(f"ASI1_API_KEY: {asi1[:20] if asi1 else 'NOT FOUND'}...")
print(f"GEMINI_API_KEY: {gemini[:20] if gemini else 'NOT FOUND'}...")
