#C:\Users\aisha\Downloads\Rawasi\rawasi-backend\Recommendation\recommendation_api.py
"""
RAWASI Provider Recommendation API
Connects React frontend with LLM recommendation engine
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
from PIL import Image
import io
import base64
import re

# Load environment variables
load_dotenv('.env')

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class SupplierRecommendationAPI:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            try:
                genai.configure(api_key=api_key)
                model_name = 'models/gemini-2.0-flash-exp'
                self.model = genai.GenerativeModel(model_name)
                self.vision_model = self.model
                self.ai_enabled = True
                print(f"✅ AI features enabled using: {model_name}")
            except Exception as e:
                print(f"⚠️ AI initialization failed: {e}")
                self.ai_enabled = False
        else:
            print("⚠️ No API key found - using basic matching")
            self.ai_enabled = False
        
        # Load suppliers data
        self.suppliers_data = self.load_suppliers_data()
        self.tech_complexity_data = self.load_tech_complexity_data()
    
    def load_suppliers_data(self):
        """Load suppliers data from the JSON file"""
        try:
            with open('modern_building_contractors - En.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"✅ Loaded {len(data)} suppliers from JSON file")
                return data
        except Exception as e:
            print(f"❌ Error reading JSON file: {e}")
            return []
    
    def load_tech_complexity_data(self):
        """Load technology complexity data matching your frontend options"""
        return {
            "Autoclaved Aerated Concrete": {"complexity_range": (2, 5), "alias": ["AAC", "ALC"]},
            "Precast system": {"complexity_range": (4, 8), "alias": ["Precast Concrete"]},
            "ICF": {"complexity_range": (4, 7), "alias": ["Insulated Concrete Forms"]},
            "Modular LGS": {"complexity_range": (4, 6), "alias": ["Light Steel", "Prefabricated Units"]},
            "Repidwall": {"complexity_range": (5, 8), "alias": ["Rapid Wall"]},
            "Tunnel Formwork": {"complexity_range": (6, 9), "alias": ["Tunnel Forms"]},
            "3D panel system (M2)": {"complexity_range": (4, 7), "alias": ["3D Panel"]},
            "Concrete modular": {"complexity_range": (7, 10), "alias": ["Modular Concrete"]},
            "Panel Wall System": {"complexity_range": (5, 8), "alias": ["Wall Panel"]},
            "Post tension": {"complexity_range": (4, 8), "alias": ["Post-tension"]},
            "Form work system": {"complexity_range": (3, 6), "alias": ["Formwork"]},
            "Steel Structer": {"complexity_range": (5, 8), "alias": ["Steel Frame", "Steel Structure"]},
            "ALC": {"complexity_range": (2, 5), "alias": ["Autoclaved Lightweight Concrete"]},
            "BIM": {"complexity_range": (5, 9), "alias": ["Building Information Modeling"]},
            "Prefabrication": {"complexity_range": (4, 8), "alias": ["Prefab"]},
        }
    
    def analyze_construction_plan(self, image_data):
        """Analyze construction plan complexity using AI"""
        if not self.ai_enabled:
            return None
        
        try:
            # Decode base64 image
            if ',' in image_data:
                image_bytes = base64.b64decode(image_data.split(',')[1])
            else:
                image_bytes = base64.b64decode(image_data)
            
            image = Image.open(io.BytesIO(image_bytes))
            
            prompt = """
            Analyze this construction plan and evaluate its complexity on a scale of 1 to 10.
            Consider these factors:
            - Structural complexity (number of floors, unique shapes, spans)
            - Number of different elements and components
            - Integration requirements for systems (MEP, etc.)
            - Construction methodology requirements
            - Scale and size of the project
            
            Provide ONLY a complexity score from 1-10 and a brief explanation.
            
            Format your response as:
            Complexity Score: X/10
            Explanation: [brief explanation]
            """
            
            response = self.vision_model.generate_content([prompt, image])
            return response.text
            
        except Exception as e:
            print(f"⚠️ Error analyzing image: {e}")
            return None
    
    def parse_complexity_score(self, analysis_text):
        """Parse complexity score from AI analysis"""
        try:
            if not analysis_text:
                return 5  # Default medium complexity
            
            lines = analysis_text.split('\n')
            for line in lines:
                if 'Complexity Score:' in line or 'Score:' in line:
                    numbers = re.findall(r'\d+', line)
                    if numbers:
                        score = int(numbers[0])
                        return min(max(score, 1), 10)
        except Exception as e:
            print(f"⚠️ Error parsing complexity score: {e}")
        
        return 5  # Default medium complexity
    
    def recommend_tech_based_on_complexity(self, complexity_score):
        """Recommend technology types based on complexity score"""
        recommendations = []
        
        for tech_name, tech_data in self.tech_complexity_data.items():
            min_comp, max_comp = tech_data["complexity_range"]
            if min_comp <= complexity_score <= max_comp:
                range_center = (min_comp + max_comp) / 2
                suitability = 100 - abs(complexity_score - range_center) * 10
                suitability = max(suitability, 0)
                
                recommendations.append({
                    'technology': tech_name,
                    'suitability_score': suitability
                })
        
        recommendations.sort(key=lambda x: x['suitability_score'], reverse=True)
        return recommendations
    
    def find_matching_suppliers(self, project_data):
        """Find matching suppliers based on project requirements"""
        matching_suppliers = []
        target_location = project_data.get('location', '').strip()
        target_techs = project_data.get('techNeeds', [])
        
        # If no tech specified, use first one or default
        if not target_techs:
            target_techs = ['BIM']
        
        print(f"🔍 Searching for suppliers in '{target_location}' with technologies: {target_techs}")
        
        for supplier in self.suppliers_data:
            supplier_name = supplier.get('Contractor_Name') or supplier.get('Factory_Name')
            if not supplier_name:
                continue
            
            supplier_tech = supplier.get('Building_Tech_Type') or supplier.get('Tech_Type', '')
            if not supplier_tech:
                continue
            
            supplier_region = supplier.get('Preferred_Region', '')
            actual_rating = supplier.get('totalScore', 'N/A')
            
            # Check region match
            region_match = (
                target_location.lower() in supplier_region.lower() or
                supplier_region.lower() in target_location.lower() or
                'all' in supplier_region.lower()
            )
            
            # Check technology match (match ANY of the selected technologies)
            tech_match = False
            matched_tech = None
            for tech in target_techs:
                if tech.lower() in supplier_tech.lower():
                    tech_match = True
                    matched_tech = tech
                    break
                # Check aliases
                tech_data = self.tech_complexity_data.get(tech, {})
                for alias in tech_data.get('alias', []):
                    if alias.lower() in supplier_tech.lower():
                        tech_match = True
                        matched_tech = tech
                        break
                if tech_match:
                    break
            
            # Calculate match score
            match_score = 0
            match_reasons = []
            
            if region_match:
                match_score += 50
                match_reasons.append("Region match")
            
            if tech_match:
                match_score += 50
                match_reasons.append("Technology expertise")
            
            # Rating bonus
            if isinstance(actual_rating, (int, float)):
                rating_bonus = (actual_rating - 3.0) * 10
                match_score += rating_bonus
            
            # Only include if technology matches
            if tech_match:
                matching_suppliers.append({
                    'name': supplier_name,
                    'alliance': supplier.get('Alliance_Company_Name', 'N/A'),
                    'region': supplier_region,
                    'technology': supplier_tech,
                    'rating': actual_rating,
                    'contact': supplier.get('Contact_Person', 'N/A'),
                    'email': supplier.get('Email', 'N/A'),
                    'phone': supplier.get('Mobile_Number', 'N/A'),
                    'match_score': round(match_score, 1),
                    'match_reasons': match_reasons,
                    'region_match': region_match,
                    'tech_match': tech_match,
                    'matched_technology': matched_tech
                })
        
        # Sort by match score
        matching_suppliers.sort(key=lambda x: x['match_score'], reverse=True)
        return matching_suppliers
    
    def get_ai_insights(self, project_data, matching_suppliers):
        """Get AI-powered insights about the recommendations"""
        if not self.ai_enabled or not matching_suppliers:
            return None
        
        try:
            prompt = f"""
            # SUPPLIER RECOMMENDATION INSIGHTS
            
            ## PROJECT:
            - Name: {project_data.get('name', 'Unnamed Project')}
            - Type: {project_data.get('type', 'Residential')}
            - Location: {project_data['location']}
            - Size: {project_data.get('sizeSqm', 'N/A')} sqm
            - Budget: {project_data.get('budget', 'N/A')} SAR
            - Timeline: {project_data.get('timelineMonths', 'N/A')} months
            - Technologies: {', '.join(project_data.get('techNeeds', []))}
            - Complexity: {project_data.get('complexity_score', 'N/A')}/10
            
            ## TOP SUPPLIERS:
            {json.dumps(matching_suppliers[:3], indent=2, ensure_ascii=False)}
            
            Provide concise insights in JSON format:
            {{
                "summary": "Brief overview of recommendations (2-3 sentences)",
                "key_advantages": ["advantage 1", "advantage 2", "advantage 3"],
                "potential_risks": ["risk 1", "risk 2"],
                "recommendations": "Specific advice for this project (2-3 sentences)"
            }}
            
            Keep it practical and construction-focused.
            """
            
            response = self.model.generate_content(prompt)
            
            # Try to parse JSON from response
            try:
                text = response.text
                if '```json' in text:
                    text = text.split('```json')[1].split('```')[0].strip()
                elif '```' in text:
                    text = text.split('```')[1].split('```')[0].strip()
                
                return json.loads(text)
            except:
                return {
                    "summary": response.text[:200] + "...",
                    "key_advantages": [],
                    "potential_risks": [],
                    "recommendations": response.text
                }
                
        except Exception as e:
            print(f"⚠️ Error generating AI insights: {e}")
            return None

# Initialize the API
recommendation_api = SupplierRecommendationAPI()

# API Endpoints
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ai_enabled': recommendation_api.ai_enabled,
        'suppliers_loaded': len(recommendation_api.suppliers_data)
    })

@app.route('/api/recommend', methods=['POST'])
def recommend_providers():
    """Main recommendation endpoint that receives data from frontend"""
    try:
        data = request.json
        print(f"\n📥 Received recommendation request:")
        print(f"   Project: {data.get('name', 'Unnamed')}")
        print(f"   Location: {data.get('location', 'N/A')}")
        print(f"   Technologies: {data.get('techNeeds', [])}")
        
        # Extract project data from frontend
        project_data = {
            'name': data.get('name', ''),
            'type': data.get('type', 'Residential'),
            'location': data.get('location', 'Riyadh'),
            'sizeSqm': data.get('sizeSqm', 1500),
            'budget': data.get('budget', 2000000),
            'timelineMonths': data.get('timelineMonths', 12),
            'Nfloors': data.get('Nfloors', 2),
            'techNeeds': data.get('techNeeds', []),
            'preferences': data.get('preferences', {}),
        }
        
        # Analyze construction plan if provided
        complexity_analysis = None
        complexity_score = 5  # Default medium
        
        if data.get('planImage'):
            print("📷 Analyzing construction plan image...")
            complexity_analysis = recommendation_api.analyze_construction_plan(data['planImage'])
            if complexity_analysis:
                complexity_score = recommendation_api.parse_complexity_score(complexity_analysis)
                print(f"✅ Complexity score: {complexity_score}/10")
        
        project_data['complexity_score'] = complexity_score
        project_data['complexity_analysis'] = complexity_analysis
        
        # Get technology recommendations based on complexity
        tech_recommendations = recommendation_api.recommend_tech_based_on_complexity(complexity_score)
        project_data['tech_recommendations'] = tech_recommendations
        
        # Find matching suppliers
        print("🔍 Finding matching suppliers...")
        matching_suppliers = recommendation_api.find_matching_suppliers(project_data)
        
        if not matching_suppliers:
            print(f"❌ No suppliers found matching criteria")
            return jsonify({
                'success': False,
                'message': f"No suppliers found with selected technologies: {', '.join(project_data['techNeeds'])}",
                'tech_recommendations': tech_recommendations[:5],
                'suggested_technologies': [t['technology'] for t in tech_recommendations[:5]]
            })
        
        print(f"✅ Found {len(matching_suppliers)} matching suppliers")
        
        # Get top 5 suppliers
        top_suppliers = matching_suppliers[:5]
        
        # Get AI insights
        print("💡 Generating AI insights...")
        ai_insights = recommendation_api.get_ai_insights(project_data, top_suppliers)
        
        response_data = {
            'success': True,
            'project_complexity': complexity_score,
            'complexity_analysis': complexity_analysis,
            'total_matches': len(matching_suppliers),
            'suppliers': top_suppliers,
            'tech_recommendations': tech_recommendations[:5],
            'ai_insights': ai_insights,
            'project_summary': {
                'name': project_data['name'],
                'type': project_data['type'],
                'location': project_data['location'],
                'budget': project_data['budget'],
                'timeline': project_data['timelineMonths'],
                'technologies': project_data['techNeeds']
            }
        }
        
        print(f"✅ Returning {len(top_suppliers)} recommendations")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Error in recommend endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'An error occurred while processing your request'
        }), 500

@app.route('/api/technologies', methods=['GET'])
def get_technologies():
    """Get list of available technologies"""
    techs = list(recommendation_api.tech_complexity_data.keys())
    return jsonify({
        'success': True,
        'technologies': techs
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 RAWASI Provider Recommendation API")
    print("="*60)
    print(f"✅ Suppliers loaded: {len(recommendation_api.suppliers_data)}")
    print(f"✅ AI enabled: {recommendation_api.ai_enabled}")
    print(f"✅ Technologies available: {len(recommendation_api.tech_complexity_data)}")
    print("="*60)
    print("📡 Ready to receive requests from React frontend\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True)