import requests

def check_email(email:str):
    response = requests.get(f"https://emailvalidation.abstractapi.com/v1/?api_key=f6ace131d06949638e8e059128a3e939&email={email}")
    return response.content.decode()

# ====================================

def check_phone(country:str, phone:str):
    response = requests.get(f"https://phonevalidation.abstractapi.com/v1/?api_key=6857c4b730fd4645a2f7be3e194e12ec&phone={phone}&country={country}")
    return response.content.decode()

# =====================================

def check_iban(iban:str):
    response = requests.get(f"https://vat.abstractapi.com/v1/validate/?api_key=51a69b7cd69d4e04aee711339bbc53bd&vat_number={iban}")
    return response.content.decode()