import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset
df = pd.read_csv("customers.csv")

# ── Text feature engineering from last_chat_text ──────────────────────────────
chat_keywords = {
    "chat_home":     ["house", "home loan", "home"],
    "chat_car":      ["car"],
    "chat_invest":   ["invest", "savings", "grow"],
    "chat_credit":   ["credit card"],
    "chat_personal": ["personal loan"],
    "chat_no_loan":  ["don't want", "not comfortable", "no loan"],
}

for col, keywords in chat_keywords.items():
    df[col] = df["last_chat_text"].str.lower().apply(
        lambda text: int(any(kw in text for kw in keywords))
    )

# ── Features ──────────────────────────────────────────────────────────────────
feature_cols = [
    "age",
    "salary",
    "monthly_expense",
    "savings",
    "credit_score",
    "existing_loans",
    "car_related_transactions",
    "real_estate_related_transactions",
    "investment_transactions",
    "app_login_frequency",
    "engagement_score",
    "debt_ratio",
    # engineered text features
    "chat_home",
    "chat_car",
    "chat_invest",
    "chat_credit",
    "chat_personal",
    "chat_no_loan",
]

X = df[feature_cols]

# ── Target ────────────────────────────────────────────────────────────────────
y = df["target_product"]
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Stratified split keeps class proportions in both train & test
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# ── Models ────────────────────────────────────────────────────────────────────
rf = RandomForestClassifier(
    n_estimators=500,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)

gb = GradientBoostingClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    min_samples_split=2,
    subsample=0.8,
    random_state=42,
)

# Soft voting: combines probability estimates of both models
ensemble = VotingClassifier(
    estimators=[("rf", rf), ("gb", gb)],
    voting="soft",
)

# ── Train & Evaluate ──────────────────────────────────────────────────────────
ensemble.fit(X_train, y_train)
y_pred = ensemble.predict(X_test)

print("\n===== CLASSIFICATION REPORT =====\n")
print(classification_report(y_test, y_pred, target_names=le.classes_))

print("Accuracy:", round(accuracy_score(y_test, y_pred) * 100, 2), "%")

cv_scores = cross_val_score(ensemble, X, y_encoded, cv=5, scoring="accuracy")
print(f"5-Fold CV Accuracy: {round(cv_scores.mean() * 100, 2)}% ± {round(cv_scores.std() * 100, 2)}%")

# ── Save ──────────────────────────────────────────────────────────────────────
joblib.dump(ensemble, "cross_sell_model.pkl")
joblib.dump(le, "label_encoder.pkl")
joblib.dump(feature_cols, "feature_cols.pkl")   # column order needed for predict.py

print("\nModel trained and saved successfully!")
