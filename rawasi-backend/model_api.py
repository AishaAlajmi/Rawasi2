# =========================================================
# RAWASI Model API - Flask Server
# Serves the trained Ridge model for cost predictions
# =========================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the trained model bundle
MODEL_PATH = "rawasi_model/rawasi_lin_logbundle.pkl"
bundle = None

# IMPORTANT: Define the log1p_array function (needed for unpickling the model)
def log1p_array(X):
    """Log1p transformation for numeric features (needed for model unpickling)"""
    return np.log1p(X)

def load_model():
    """Load the model bundle on startup"""
    global bundle
    try:
        bundle = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

def _to_date(date_str):
    """Convert date string to datetime"""
    try:
        return pd.to_datetime(date_str, errors='coerce', dayfirst=True)
    except:
        return None

def predict_cost_from_inputs(
    project_type: str,
    size_sqm: float,
    location: str,
    timeline_months: int,
    rate_sar_m2: float = 750.0  # Default rate
) -> dict:
    """
    Predict project cost based on user inputs
    
    Parameters:
    - project_type: Type of project (Residential, Commercial, etc.)
    - size_sqm: Project size in square meters
    - location: City/Region (e.g., "Riyadh", "Jeddah")
    - timeline_months: Expected timeline in months
    - rate_sar_m2: Cost per square meter (default: 750 SAR/m²)
    
    Returns:
    - Dictionary with prediction results
    """
    if bundle is None:
        return {"error": "Model not loaded"}
    
    try:
        # Map project type to sectors
        sector_mapping = {
            "Residential": "سكني",
            "Commercial": "تجاري",
            "Industrial": "صناعي",
            "Mixed-Use": "مختلط"
        }
        sectors = sector_mapping.get(project_type, "سكني")
        
        # Calculate duration in days
        duration_days = timeline_months * 30
        
        # Prepare region text (simplified - you may need to adjust based on your data)
        region_mapping = {
            "Riyadh": "منطقة الرياض, الرياض",
            "Jeddah": "منطقة مكة المكرمة, جدة",
            "Dammam": "المنطقة الشرقية, الدمام",
            "Mecca": "منطقة مكة المكرمة, مكة المكرمة",
            "Medina": "منطقة المدينة المنورة, المدينة المنورة"
        }
        region_text = region_mapping.get(location, "منطقة الرياض, الرياض")
        
        # Split region into macro_region and city
        if ',' in region_text:
            macro_region, city = [x.strip() for x in region_text.split(',', 1)]
        else:
            macro_region, city = region_text, 'Unknown'
        
        # Create input DataFrame
        input_data = pd.DataFrame([{
            'sectors': sectors,
            'macro_region': macro_region,
            'city': city,
            'area_project_imputed_m2': float(size_sqm),
            'rate_used_sar_m2': float(rate_sar_m2),
            'duration_days': float(duration_days)
        }])
        
        # Make prediction
        model = bundle['model']
        pred_log = model.predict(input_data)[0]
        pred_cost = np.expm1(pred_log)
        pred_cost = float(max(pred_cost, 0.0))
        
        # Calculate confidence interval (rough estimate based on ±15% variation)
        confidence_lower = pred_cost * 0.85
        confidence_upper = pred_cost * 1.15
        
        return {
            "success": True,
            "predicted_cost": round(pred_cost, 2),
            "confidence_interval": {
                "lower": round(confidence_lower, 2),
                "upper": round(confidence_upper, 2)
            },
            "cost_per_sqm": round(pred_cost / size_sqm, 2),
            "inputs": {
                "project_type": project_type,
                "size_sqm": size_sqm,
                "location": location,
                "timeline_months": timeline_months,
                "rate_sar_m2": rate_sar_m2
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": bundle is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    
    Expected JSON body:
    {
        "project_type": "Residential",
        "size_sqm": 1500,
        "location": "Riyadh",
        "timeline_months": 12,
        "rate_sar_m2": 750  // optional
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['project_type', 'size_sqm', 'location', 'timeline_months']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Get optional rate or use default
        rate_sar_m2 = data.get('rate_sar_m2', 750.0)
        
        # Make prediction
        result = predict_cost_from_inputs(
            project_type=data['project_type'],
            size_sqm=float(data['size_sqm']),
            location=data['location'],
            timeline_months=int(data['timeline_months']),
            rate_sar_m2=float(rate_sar_m2)
        )
        
        if result.get('success'):
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Batch prediction endpoint for multiple projects
    
    Expected JSON body:
    {
        "projects": [
            {
                "project_type": "Residential",
                "size_sqm": 1500,
                "location": "Riyadh",
                "timeline_months": 12
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        projects = data.get('projects', [])
        
        if not projects:
            return jsonify({
                "success": False,
                "error": "No projects provided"
            }), 400
        
        results = []
        for project in projects:
            result = predict_cost_from_inputs(
                project_type=project.get('project_type', 'Residential'),
                size_sqm=float(project.get('size_sqm', 1500)),
                location=project.get('location', 'Riyadh'),
                timeline_months=int(project.get('timeline_months', 12)),
                rate_sar_m2=float(project.get('rate_sar_m2', 750))
            )
            results.append(result)
        
        return jsonify({
            "success": True,
            "predictions": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        # Run the Flask app
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("❌ Failed to load model. Please ensure the model file exists.")