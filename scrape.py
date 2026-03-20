import requests
from bs4 import BeautifulSoup
import json
import time

base_url = "https://www.gusmaomadeiras.com.br"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

products = []
visited = set()
to_visit = [base_url]
social_links = set()
contact_info = []

while to_visit:
    url = to_visit.pop(0)
    if url in visited: continue
    visited.add(url)
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Extract social links
        for a in soup.find_all('a', href=True):
            href = a['href']
            if 'instagram.com' in href or 'facebook.com' in href or 'wa.me' in href or 'whatsapp.com' in href:
                social_links.add(href)
                
            if href.startswith('/'):
                full_url = base_url + href
            elif href.startswith(base_url):
                full_url = href
            else:
                continue
                
            if '-p/' in full_url or '/produtos/' in full_url or '/p/' in full_url or 'produto' in full_url.lower():
                # potential product page
                if full_url not in visited and full_url not in to_visit:
                    to_visit.append(full_url)
            elif '/categoria/' in full_url.lower() or '/c/' in full_url.lower() or 'linha' in full_url.lower() or 'portas' in full_url.lower() or 'janelas' in full_url.lower() or 'basculas' in full_url.lower() or 'seteiras' in full_url.lower():
                if full_url not in visited and full_url not in to_visit:
                    to_visit.append(full_url)
                    
        # Check if this page itself is a product
        # usually has a specific class for product name, image, description
        title_el = soup.find('h1')
        if title_el and not ('categoria' in url or url == base_url or url == base_url + '/'):
            # Looking for main image
            img_el = soup.select_one('.product-image img, #image-main, .js-product-image, .box-image img, meta[property="og:image"]')
            img_url = ""
            if img_el:
                img_url = img_el.get('content') or img_el.get('src')
                if img_url and img_url.startswith('//'):
                    img_url = 'https:' + img_url
            
            # description
            desc_el = soup.select_one('.product-description, #description, .js-product-description')
            desc = desc_el.text.strip() if desc_el else ""
            
            p_data = {
                'url': url,
                'title': title_el.text.strip(),
                'image': img_url,
                'description': desc
            }
            if p_data['title']:
                print(f"Found product: {p_data['title']}")
                products.append(p_data)
                
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        
    if len(visited) > 150: # safety limit
        break

data = {
    'social_links': list(social_links),
    'products': products
}

with open('scraped_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Finished. Scraped {len(products)} products.")
