def calculate_health_index(health):
    """
    Calculates AI Health Index (0-100) from HealthRecord object or dictionary.
    Returns composite score.
    """
    heart_rate = getattr(health, 'heart_rate', 75)
    blood_pressure = getattr(health, 'blood_pressure', '120/80')
    spo2 = getattr(health, 'spo2', 98)
    temperature = getattr(health, 'temperature', 37.0)
    sugar_level = getattr(health, 'sugar_level', 100)
    bmi = getattr(health, 'bmi', 22.0)

    # Parse Blood Pressure
    sys_bp, dia_bp = 120, 80
    try:
        if "/" in str(blood_pressure):
            parts = str(blood_pressure).strip().split("/")
            sys_bp, dia_bp = int(parts[0]), int(parts[1])
        else:
            sys_bp = int(blood_pressure)
    except Exception:
        sys_bp, dia_bp = 120, 80

    # Cardiovascular Score (Heart Rate + BP)
    hr_score = 100 if 60 <= heart_rate <= 100 else (80 if 50 <= heart_rate <= 120 else 50)
    bp_score = 100 if (90 <= sys_bp <= 125 and 60 <= dia_bp <= 82) else (80 if sys_bp <= 135 else 60)
    cardio_score = (hr_score * 0.5) + (bp_score * 0.5)

    # Respiratory Score (SpO2 + Temp)
    spo2_score = 100 if spo2 >= 98 else (85 if spo2 >= 95 else 40)
    temp_score = 100 if 36.1 <= temperature <= 37.3 else (75 if temperature <= 38.0 else 50)
    respiratory_score = (spo2_score * 0.7) + (temp_score * 0.3)

    # Metabolic Score (Sugar + BMI)
    sugar_score = 100 if 70 <= sugar_level <= 115 else (75 if sugar_level <= 140 else 50)
    bmi_score = 100 if 18.5 <= bmi <= 24.9 else (80 if bmi <= 29.9 else 60)
    metabolic_score = (sugar_score * 0.6) + (bmi_score * 0.4)

    # Composite Health Index
    index = round((cardio_score * 0.4) + (respiratory_score * 0.3) + (metabolic_score * 0.3))
    return max(0, min(100, index))


def get_health_status(score):
    if score >= 85:
        return "Optimal"
    elif score >= 70:
        return "Healthy"
    elif score >= 55:
        return "Moderate Risk"
    else:
        return "Critical Alert"


def get_ai_health_analysis(health):
    score = calculate_health_index(health)
    status = get_health_status(score)

    heart_rate = getattr(health, 'heart_rate', 75)
    blood_pressure = getattr(health, 'blood_pressure', '120/80')
    spo2 = getattr(health, 'spo2', 98)
    temperature = getattr(health, 'temperature', 37.0)
    sugar_level = getattr(health, 'sugar_level', 100)
    bmi = getattr(health, 'bmi', 22.0)

    # Sub scores
    cardio = 100 if 60 <= heart_rate <= 100 else 75
    respiratory = 100 if spo2 >= 95 else 50
    metabolic = 100 if sugar_level <= 140 else 70

    recommendations = []
    if spo2 < 95:
        recommendations.append({"category": "Respiratory", "priority": "High", "text": "Oxygen level is low (<95%). Practice deep breathing and consult a doctor."})
    if sugar_level > 140:
        recommendations.append({"category": "Metabolic", "priority": "High", "text": "Blood sugar is elevated. Maintain hydration and reduce refined carbs."})
    if heart_rate > 100 or heart_rate < 60:
        recommendations.append({"category": "Cardio", "priority": "Medium", "text": "Heart rate outside resting range (60-100 bpm). Monitor during resting periods."})
    if bmi > 25:
        recommendations.append({"category": "Biometrics", "priority": "Low", "text": "BMI indicates overweight range. Daily active walking is recommended."})

    if not recommendations:
        recommendations.append({"category": "General", "priority": "Info", "text": "All vitals look great! Keep up your healthy lifestyle."})

    return {
        "health_index": score,
        "status": status,
        "sub_scores": {
            "cardiovascular": cardio,
            "respiratory": respiratory,
            "metabolic": metabolic,
        },
        "recommendations": recommendations
    }