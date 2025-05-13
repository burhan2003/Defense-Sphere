import requests
import base64
from datetime import datetime

#! DOCUMENTATION: https://newsapi.org/docs

API = base64.b64decode('ZjU3ODk4NmNiNjQ3NDhlMDk5NTZiMjZkNjE3NGRiNjY=').decode()

def run(query:str='Cybersecurity Trends'):

       today = datetime.today().strftime('%Y-%m-%d')
       url = (f'https://newsapi.org/v2/everything?'
              f'q={query}&'
              f'apiKey={API}&'
              f'to={today}&'
              f'sortBy=publishedAt&'
              f'pageSize=10&'
              f'language=en')

       response = requests.get(url).json()

       return response

if __name__ == '__main__':
       run()