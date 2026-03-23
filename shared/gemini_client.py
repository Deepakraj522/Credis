"""
Google Gemini API Client
Handles communication with the Google Gemini AI API
"""

import os
from google import genai
from dotenv import load_dotenv
from pathlib import Path


def ask_gemini(prompt):
    """
    Send a prompt to the Google Gemini API and get a response.
    
    Args:
        prompt (str): The user prompt to send to Gemini
        
    Returns:
        str: The response text from Gemini, or None if an error occurs
    """
    try:
        # Load environment variables from .env file
        env_path = Path(__file__).parent.parent / ".env"
        load_dotenv(env_path)
        
        # Get API key from environment
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            print("Error: GEMINI_API_KEY not found in .env file")
            return None
        
        # Initialize the client with API key
        client = genai.Client(api_key=api_key)
        
        # Send the prompt and get response using gemini-2.0-flash
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Return the response text
        if response.text:
            return response.text
        else:
            print("Error: Empty response from Gemini API")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None