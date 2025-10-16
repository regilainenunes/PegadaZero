EMISSION_FACTORS = {
    "energia": 0.5,       # kg CO2e por kWh (exemplo)
    "transporte": 0.2,    # kg CO2e por km (exemplo)
    "residuos": 1.0,      # kg CO2e por kg (exemplo)
}


def calculate_emissions(category: str, amount: float) -> float:
    factor = EMISSION_FACTORS.get(category, 0.0)
    return round(amount * factor, 6)