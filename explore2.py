import requests
from bs4 import BeautifulSoup

url = "https://www.gusmaomadeiras.com.br/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')

print("Title:", soup.title.string if soup.title else "No title")
links = [a['href'] for a in soup.find_all('a', href=True)]
print("Found links:", len(links))
for link in set(links):
    print(link)
