def get_recommendations(health):

    recommendations = []

    if health.spo2 < 95:
        recommendations.append("⚠ Low oxygen detected. Visit the nearest hospital immediately.")

    if health.heart_rate > 100:
        recommendations.append("❤ High heart rate detected. Rest and consult a doctor.")

    if health.heart_rate < 60:
        recommendations.append("❤ Low heart rate detected. Seek medical advice.")

    if health.temperature > 38:
        recommendations.append("🌡 High body temperature. Stay hydrated and monitor your fever.")

    if health.sugar_level > 140:
        recommendations.append("🩸 High sugar level. Avoid sweets and consult your physician.")

    if health.bmi > 30:
        recommendations.append("🏃 BMI is high. Follow a healthy diet and exercise regularly.")

    if health.blood_pressure != "120/80":
        recommendations.append("🩺 Monitor your blood pressure regularly.")

    if len(recommendations) == 0:
        recommendations.append("✅ Your health looks good. Maintain your healthy lifestyle.")

    return recommendations