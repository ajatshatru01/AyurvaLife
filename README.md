# AyurvaLife - Ayurvedic Practice Management System

A comprehensive cloud-based practice management system for Ayurvedic dietitians, featuring AI-powered personalization and food analysis capabilities.

## Features

### 🏥 Practice Management
- Patient management system with comprehensive profiles
- Ayurvedic constitution (dosha) assessment
- Diet plan generation based on individual needs
- Progress tracking and health parameter monitoring

### 🍽️ AI-Powered Food Analysis
- **Image Recognition**: Upload food images for instant dish identification
- **Ingredient Analysis**: Automatic detection of main ingredients with percentages
- **Ayurvedic Properties**: Detailed analysis of Rasa (taste), Virya (energy), and Vipaka (post-digestive effects)
- **Dosha Impact**: Understanding how foods affect Vata, Pitta, and Kapha
- **Personalized Recommendations**: Customized dietary advice based on individual constitution

### 📚 Educational Resources
- Interactive dosha assessment quiz
- Comprehensive dosha learning materials
- Ayurvedic food properties database
- Traditional wisdom meets modern technology

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python Flask
- **AI/ML**: Google Gemini Vision API for image analysis
- **Database**: JSON-based patient storage (development)
- **Styling**: Custom CSS with design system

## Setup Instructions

### Prerequisites
- Python 3.8+
- Google API key for Gemini
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AyurvaLife
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API keys
   # GOOGLE_API_KEY=your_google_api_key_here
   # OPENROUTER_API_KEY=your_openrouter_api_key_here (optional)
   ```

4. **Start the backend server**
   ```bash
   python diet.py
   ```
   Server will start on `http://localhost:5000`

5. **Open the application**
   Open `index.html` in your web browser or serve it through a local server:
   ```bash
   # Using Python's built-in server
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080`

## Usage

### For Dietitians
1. **Login** using demo credentials (demo@ayurvalife.com / demo123)
2. **Manage Patients**: Add, edit, and view patient profiles
3. **Generate Diet Plans**: Create personalized Ayurvedic diet recommendations
4. **Track Progress**: Monitor patient health parameters and dietary habits

### Food Analysis Feature
1. Navigate to the **Food Analysis** page
2. **Upload an image** of any food dish
3. **Get instant analysis** including:
   - Dish identification
   - Main ingredients
   - Ayurvedic properties (Rasa, Virya, Vipaka)
   - Dosha effects
   - Personalized recommendations

### Dosha Assessment
1. Visit the **Learn Doshas** page
2. Take the interactive quiz
3. Get your personalized dosha constitution
4. Learn about dietary recommendations

## API Endpoints

### Backend APIs
- `GET /api/health` - Health check
- `POST /api/diet-plan` - Generate personalized diet plan
- `POST /api/analyze-image` - Analyze food image for Ayurvedic properties

### Request Formats

**Image Analysis Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Diet Plan Request:**
```json
{
  "name": "Patient Name",
  "age": 35,
  "gender": "Female",
  "height": 165,
  "weight": 60,
  "dosha": "Pitta",
  "dietaryHabits": "Vegetarian",
  "medicalHistory": "..."
}
```

## Food Analysis Technology

The food analysis feature uses advanced AI to:

1. **Identify Dishes**: Recognizes various cuisines and dishes
2. **Extract Ingredients**: Lists main ingredients with estimated percentages
3. **Ayurvedic Analysis**: Maps ingredients to traditional Ayurvedic properties
4. **Dosha Assessment**: Determines effects on Vata, Pitta, and Kapha
5. **Personalized Advice**: Provides recommendations based on individual constitution

### Supported Features
- Image upload (JPG, PNG up to 5MB)
- Drag and drop interface
- Real-time analysis
- Detailed property breakdown
- Mobile-responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Team

**SIH 2025 Team**
- Tarun
- Utsav  
- Tanmay
- Kavya
- Rudrakshi
- Nihira

*Computer Engineering Students, VJTI Mumbai*

## License

This project is developed for Smart India Hackathon 2025.

## Support

For support or questions, please contact the development team.

---

*Bridging Ancient Wisdom with Modern Technology*