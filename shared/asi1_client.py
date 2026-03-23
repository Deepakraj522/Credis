"""
ASI1 API Client
Handles communication with the ASI1 AI API
"""

import os
import requests
from dotenv import load_dotenv
from pathlib import Path


def ask_asi1(prompt):
    """
    Send a prompt to the ASI1 API and get a response.
    
    Args:
        prompt (str): The user prompt to send to ASI1
        
    Returns:
        str: The response text from ASI1, or None if an error occurs
    """
    try:
        # Load environment variables from .env file
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(env_path)
        
        # Get API key from environment
        api_key = os.getenv("ASI1_API_KEY")
        
        if not api_key:
            print("Error: ASI1_API_KEY not found in .env file")
            return None
        
        # Prepare the API request
        url = "https://api.asi1.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        body = {
            "model": "asi1-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
        
        # Make the API request
        response = requests.post(url, json=body, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Extract and return the response text
        response_data = response.json()
        
        # Navigate through the response structure to get the message content
        if "choices" in response_data and len(response_data["choices"]) > 0:
            message_content = response_data["choices"][0].get("message", {}).get("content")
            if message_content:
                return message_content
        
        print("Error: Unexpected response format from ASI1 API")
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"Error: Request failed - {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None
