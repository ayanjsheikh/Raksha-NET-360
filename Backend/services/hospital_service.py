from math import radians, sin, cos, sqrt, atan2
from data.hospitals import hospitals


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in KM

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


def get_nearby_hospitals(lat, lon):

    nearby = []

    for hospital in hospitals:

        distance = calculate_distance(
            lat,
            lon,
            hospital["latitude"],
            hospital["longitude"]
        )

        hospital_data = hospital.copy()
        hospital_data["distance"] = round(distance, 2)

        nearby.append(hospital_data)

    nearby.sort(key=lambda x: x["distance"])

    return nearby