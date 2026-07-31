from schemas.health_schema import HealthCreate


def calculate_risk(data: HealthCreate):
    score = 0

    if data.heart_rate > 100 or data.heart_rate < 60:
        score += 1

    if data.spo2 < 95:
        score += 1

    if data.temperature > 37.5:
        score += 1

    if data.sugar_level > 140:
        score += 1

    if data.bmi > 30:
        score += 1

    if score == 0:
        return "Low"

    elif score <= 2:
        return "Medium"

    else:
        return "High"