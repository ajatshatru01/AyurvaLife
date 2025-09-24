#!/usr/bin/env python3
"""
Test script for AyurvaLife Food Analysis API
This script tests the image analysis functionality.
"""

import requests
import base64
import json
from pathlib import Path

def test_health_endpoint():
    """Test if the Flask server is running"""
    try:
        response = requests.get('http://localhost:5000/api/health')
        if response.status_code == 200:
            print("SUCCESS: Backend server is running")
            return True
        else:
            print(f"ERROR: Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to backend server. Make sure it's running on localhost:5000")
        return False

def encode_image_to_base64(image_path):
    """Convert image file to base64 string"""
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return encoded_string
    except Exception as e:
        print(f"ERROR: Error encoding image: {e}")
        return None

def test_image_analysis(image_path=None):
    """Test the image analysis API"""
    if image_path and Path(image_path).exists():
        print(f"Testing with image: {image_path}")
        base64_image = encode_image_to_base64(image_path)
        
        if not base64_image:
            return False
            
        try:
            response = requests.post(
                'http://localhost:5000/api/analyze-image',
                json={'image': base64_image},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                print("Results:")
                print(f"   Dish: {result.get('dish', 'Unknown')}")
                print(f"   Ingredients: {result.get('ingredients', [])}")
                
                if 'ayurveda_analysis' in result:
                    analysis = result['ayurveda_analysis']
                    if 'ingredient_analysis' in analysis:
                        print(f"   Ayurvedic properties found for {len(analysis['ingredient_analysis'])} ingredients")
                return True
            else:
                error = response.json() if response.headers.get('content-type') == 'application/json' else response.text
                print(f"ERROR: Image analysis failed: {error}")
                return False
                
        except Exception as e:
            print(f"ERROR: Error during image analysis: {e}")
            return False
    else:
        print("INFO: No test image provided. Skipping image analysis test.")
        print("   To test image analysis, provide an image path as argument.")
        return True

def main():
    """Main test function"""
    print("Testing AyurvaLife Food Analysis System")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing backend connectivity...")
    if not test_health_endpoint():
        print("\nTo start the backend server, run:")
        print("   cd AyurvaLife")
        print("   python diet.py")
        return
    
    # Test 2: Image analysis (if image provided)
    print("\n2. Testing image analysis...")
    import sys
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    test_image_analysis(image_path)
    
    print("\nTesting completed!")
    print("\nNext steps:")
    print("   1. Open 'index.html' in your browser")
    print("   2. Navigate to 'Food Analysis' page")
    print("   3. Upload a food image and test the analysis")
    print("   4. Explore other features like patient management")

if __name__ == "__main__":
    main()