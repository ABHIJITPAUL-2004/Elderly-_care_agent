from __future__ import annotations

import json
import random
from pathlib import Path

random.seed(31)

conditions_pool = [
    "Hypertension",
    "Diabetes",
    "Osteoarthritis",
    "Mild frailty",
    "COPD",
    "Atrial fibrillation",
    "Parkinson's disease",
    "Dementia",
    "Insomnia",
    "Chronic heart failure",
    "Fall risk",
    "Mobility limitation",
    "Post-stroke weakness",
    "Anxiety",
    "Hyperlipidemia",
]

medications_pool = [
    "Amlodipine",
    "Losartan",
    "Metformin",
    "Atorvastatin",
    "Levodopa",
    "Carvedilol",
    "Warfarin",
    "Donepezil",
    "Salbutamol",
    "Acetaminophen",
    "Omeprazole",
    "Furosemide",
    "Insulin",
    "Clopidogrel",
    "Melatonin",
]

activity_pool = [
    "Walks short distance around the house",
    "Mostly sedentary with brief indoor movement",
    "Completed a light morning walk",
    "Uses wheelchair for most transfers",
    "Stable daily routine with family support",
    "Struggled with stairs but remained active",
    "Moved slowly with a cane",
    "Rested most of the day and did not leave home",
    "Attended a community activity and walked outdoors",
    "Needed assistance for transfers and bathing",
]

mobility_pool = [
    "Independent",
    "Uses a cane",
    "Uses a walker",
    "Wheelchair user",
    "Needs transfer assistance",
    "Mild gait instability",
    "Moderate mobility support required",
    "Slow but steady walker",
    "Severely limited mobility",
    "Stiff but able to walk short distances",
]

notes_pool = [
    "Family checks in daily.",
    "Medication reminders helpful.",
    "Needs encouragement for hydration.",
    "Mood is stable but tired in the evenings.",
    "Sleep quality fluctuates with pain.",
    "Uses assistive equipment consistently.",
    "Reports occasional dizziness after standing.",
    "Caregiver visits twice weekly.",
    "Prefers simple instructions and short routines.",
    "Track respiratory status closely.",
]

genders = ["Male", "Female", "Other", "Unknown"]


def choose_two(pool: list[str]) -> list[str]:
    count = random.choice([1, 1, 2, 2, 3])
    return random.sample(pool, count)


def blood_pressure(age: int) -> str:
    systolic = random.randint(108, 178)
    diastolic = random.randint(62, 104)
    if age > 75:
        systolic += random.randint(0, 10)
    if systolic <= diastolic:
        systolic = diastolic + random.randint(18, 40)
    return f"{systolic}/{diastolic}"


entries = []
for index in range(2500):
    age = random.randint(58, 95)
    adherence = random.randint(48, 100)
    oxygen = random.randint(88, 100)
    hr = random.randint(52, 108)
    falls = random.randint(0, 3)
    conditions = choose_two(conditions_pool)
    medications = choose_two(medications_pool)

    if "Hypertension" in conditions and "Amlodipine" not in medications:
        medications.append("Amlodipine")
    if "Diabetes" in conditions and "Metformin" not in medications:
        medications.append("Metformin")
    if "Parkinson's disease" in conditions and "Levodopa" not in medications:
        medications.append("Levodopa")

    entries.append(
        {
            "id": f"library-{index:04d}",
            "age": age,
            "gender": random.choice(genders),
            "conditions": conditions,
            "medications": sorted(set(medications)),
            "heartRate": hr,
            "bloodPressure": blood_pressure(age),
            "oxygenSaturation": oxygen,
            "dailyActivityLevel": random.choice(activity_pool),
            "sleepQuality": round(random.uniform(4.0, 8.5), 1),
            "medicationAdherence": adherence,
            "previousFalls": falls,
            "mobilityStatus": random.choice(mobility_pool),
            "notes": random.choice(notes_pool),
        }
    )

output_path = Path(__file__).resolve().parents[1] / "public" / "custom-patient-library.json"
output_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {output_path} with {len(entries)} entries")
