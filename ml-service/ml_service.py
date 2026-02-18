from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sys
import os

# Ensure we can import from predict directory
sys.path.append(os.path.join(os.path.dirname(__file__), 'predict'))

from predict import predict_customer, assign_persona, select_channel, generate_explanation, ai_voice_call_module, preprocess_input, analyze_sentiment

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Convert dict to Series-like object if necessary, but dict works with the predictive functions logic 
        # as long as keys match features.
        
        # Validate and cast types
        customer_row = preprocess_input(data)
        
        product, confidence = predict_customer(customer_row)
        persona = assign_persona(customer_row)
        channel = select_channel(customer_row)
        explanation = generate_explanation(customer_row, product)
        
        response = {
            "product": product,
            "confidence": confidence,
            "persona": persona,
            "channel": channel,
            "explanation": explanation
        }
        
        # Always include voice data for simulation purposes
        response["voice_data"] = ai_voice_call_module(customer_row, product)
             
        return jsonify(response)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_text():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Enhanced conversational logic
        text_lower = text.lower()
        stage = data.get('stage', 'conversation')
        response_text = ""

        # Logic for responding to the Intro ("Am I speaking with the account holder?")
        if stage == 'intro_response':
            if any(x in text_lower for x in ["yes", "yeah", "speaking", "correct", "that's me", "i am"]):
                 response_text = "Great, thanks for confirming! I see you have a strong relationship with FluxBank. We actually have a pre-approved offer for a premium credit card upgrade. Are you interested in hearing more?"
                 sentiment = "Positive Intent"
                 follow_up = "Product Pitch"
            elif any(x in text_lower for x in ["no", "not me", "wrong number"]):
                 response_text = "My apologies. I'll update our records. Have a great day."
                 sentiment = "Negative"
                 follow_up = "Do Not Call"
            else:
                 # Ambiguous first response
                 response_text = "Just to confirm, am I speaking with the account holder?"

        # Logic for other conversational turns
        elif "account holder" in text_lower or "speaking" in text_lower:
             # Fallback if stage isn't perfect but keywords match
             response_text = "Great, thanks for confirming! I see you have a strong relationship with FluxBank. We actually have a pre-approved offer for a premium credit card upgrade. Are you interested in hearing more?"
             sentiment = "Positive Intent"
             follow_up = "Product Pitch"
        
        elif "tell me more" in text_lower or "what is the offer" in text_lower or "details" in text_lower or "yes" in text_lower:
             # If they say 'Yes' later, they might be saying 'Yes I want to hear more'
             if sentiment == "Positive Intent" or "yes" in text_lower:
                response_text = "It comes with zero annual fees for the first year and 3% cashback on all travel. Plus, you get airport lounge access. How does that sound?"
                sentiment = "High Purchase Intent"
                follow_up = "Immediate (Within 2 hours)"
             
        elif "charges" in text_lower or "fee" in text_lower or "cost" in text_lower:
             response_text = "The card is free for the first year, and then it's just $99 annually, which is waived if you spend over $5000. It's a great deal for your spending profile."
             sentiment = "Interested"
             follow_up = "3 Days"

        elif sentiment == "High Purchase Intent":
             response_text = "That's fantastic! I can get a specialist to call you right now to finalize the details. Would that work?"       
        elif sentiment == "Positive Intent":
             response_text = "Great to hear. I can send you some more brochures to your email. Is that okay?"
        elif sentiment == "Risk Averse":
             response_text = "I understand your concern. We have some low-risk options I can email you about instead. No pressure."
        else:
             response_text = "Could you tell me a bit more about what you are looking for?"

        return jsonify({
            "sentiment": sentiment,
            "recommended_follow_up": follow_up,
            "ai_response": response_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
