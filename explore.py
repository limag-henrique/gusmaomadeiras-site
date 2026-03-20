import requests
from bs4 import BeautifulSoup
import json
import os

url = "https://www.gusmaomadeiras.com.br/"
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Let's just find all product links or image links
links = [a['href'] for a in soup.find_all('a', href=True)]
print("Found links:", len(links))
for link in set(links):
    if 'produto' in link or 'categoria' in link or 'portas' in link or 'janelas' in link:
        print(link)

