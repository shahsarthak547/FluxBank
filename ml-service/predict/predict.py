import pandas as pd
import joblib

import os

# Load saved model, encoder, and feature column order
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # ml-service root
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(os.path.join(MODEL_DIR, "cross_sell_model.pkl"))
le = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
feature_cols = joblib.load(os.path.join(MODEL_DIR, "feature_cols.pkl"))

# ── Chat text feature engineering (must match cust.py exactly) ────────────────
chat_keywords = {
    "chat_home":     ["house", "home loan", "home"],
    "chat_car":      ["car"],
    "chat_invest":   ["invest", "savings", "grow"],
    "chat_credit":   ["credit card"],
    "chat_personal": ["personal loan"],
    "chat_no_loan":  ["don't want", "not comfortable", "no loan"],
}

def preprocess_input(data):
    """Casts dictionary values to correct types."""
    processed = data.copy()
    
    # Integer columns
    int_cols = [
        'age', 'salary', 'monthly_expense', 'savings', 'credit_score', 
        'existing_loans', 'car_related_transactions', 'real_estate_related_transactions',
        'investment_transactions', 'app_login_frequency', 'engagement_score'
    ]
    
    # Float columns
    float_cols = ['debt_ratio']
    
    for col in int_cols:
        if col in processed:
            try:
                processed[col] = int(processed[col])
            except (ValueError, TypeError):
                processed[col] = 0 # Fallback
                
    for col in float_cols:
         if col in processed:
            try:
                processed[col] = float(processed[col])
            except (ValueError, TypeError):
                processed[col] = 0.0

    return processed

def add_chat_features(df):
    """Add keyword-based binary features from last_chat_text column."""
    for col, keywords in chat_keywords.items():
        df[col] = df["last_chat_text"].str.lower().apply(
            lambda text: int(any(kw in text for kw in keywords))
        )
    return df

def predict_customer(customer_row):
    # Build a single-row DataFrame so we can add chat features
    row_df = pd.DataFrame([customer_row])
    row_df = add_chat_features(row_df)

    features_df = row_df[feature_cols]

    prediction = model.predict(features_df)[0]
    probabilities = model.predict_proba(features_df)[0]

    predicted_product = le.inverse_transform([prediction])[0]
    confidence = round(max(probabilities) * 100, 2)

    return predicted_product, confidence

def assign_persona(customer_row):
    if customer_row["investment_transactions"] > 8:
        return "Investor"
    elif customer_row["debt_ratio"] > 0.7:
        return "High Spender"
    elif customer_row["savings"] > 500000:
        return "Saver"
    elif customer_row["credit_score"] > 750:
        return "Credit Elite"
    else:
        return "Balanced Customer"

def select_channel(customer_row):
    if customer_row["app_login_frequency"] > 20:
        return "In-App Notification"
    elif customer_row["engagement_score"] > 7:
        return "Email"
    else:
        return "Email Follow-up"

def generate_explanation(customer_row, product):
    reasons = []
    if customer_row["credit_score"] > 750:
        reasons.append("Strong credit profile")
    if customer_row["debt_ratio"] < 0.5:
        reasons.append("Healthy debt ratio")
    if customer_row["savings"] > 300000:
        reasons.append("Stable savings balance")
    if customer_row["investment_transactions"] > 5:
        reasons.append("Active investment behavior")
    return f"Recommended {product} because of: " + ", ".join(reasons)
def analyze_sentiment(text):
    sentiment_status = "Neutral"
    text_lower = text.lower()

    if "not comfortable" in text_lower or "don't want" in text_lower or "no loan" in text_lower:
        sentiment_status = "Risk Averse"

    elif "interested" in text_lower or "yes" in text_lower or "tell me more" in text_lower:
        sentiment_status = "Positive Intent"

    elif "planning" in text_lower or "ready" in text_lower or "apply" in text_lower:
        sentiment_status = "High Purchase Intent"

    # Determine recommended follow-up based on sentiment
    if sentiment_status == "High Purchase Intent":
        follow_up = "Immediate (Within 2 hours)"
    elif sentiment_status == "Positive Intent":
        follow_up = "2-3 Days"
    elif sentiment_status == "Risk Averse":
        follow_up = "1 Month (Nurture Campaign)"
    else:
        follow_up = "1 Week"

    return sentiment_status, follow_up

def ai_voice_call_module(customer_row, product):
    # Use the customer's last chat text as the input for the initial 'pre-call' analysis
    sentiment_status, follow_up = analyze_sentiment(customer_row["last_chat_text"])

    return {
        "voice_call_status": "ACTIVE",
        "detected_sentiment": sentiment_status,
        "dynamic_script": f"Hello! Based on your recent activity, we believe {product} aligns with your current financial goals.",
        "recommended_follow_up": follow_up
    }
if __name__ == "__main__":
    # intended to be run from ml-service/predict/
    # data is in ../../data/customers.csv
    data_path = os.path.join(BASE_DIR, "..", "data", "customers.csv")
    df = pd.read_csv(data_path)

    customer = df.iloc[5]

    product, confidence = predict_customer(customer)
    persona = assign_persona(customer)
    channel = select_channel(customer)
    explanation = generate_explanation(customer, product)
    if channel == "AI Voice Call":
        call_data = ai_voice_call_module(customer, product)
        print("Call Data:", call_data)
    print("Customer ID:", customer["customer_id"])
    print("Persona:", persona)
    print("Recommended Product:", product)
    print("Confidence:", confidence, "%")
    print("Channel:", channel)
    print("Explanation:", explanation)
    
