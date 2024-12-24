import requests
from bs4 import BeautifulSoup
from categories import Categories

def get_articles():
    results = []
    url = "https://www.uber.com/blog/portland/engineering/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
    
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    article_boxes = soup.find_all('div', class_='d4 id ie if ig ih ii ij ik il im in io')
    
    for box in article_boxes:
        title_elem = box.find('h5', class_='cg ch dz i8 ev cb ca cc jf bm jg bn jh ji ak jj jk i3 jl jm jn')
        date_elem = box.find('p', class_='c9 hk b9 je bb f8 jo')
        link_elem = box.find('a', href=True)
        tags_elem = box.find('div', class_='c9 jd b9 je bb f8')
        
        if title_elem and date_elem and link_elem:
            title = title_elem.text.strip()
            date = date_elem.text.strip().replace(" / Global", "")
            article_url = link_elem['href'] if link_elem['href'].startswith('http') else f"https://www.uber.com{link_elem['href']}"
            
            tags = [tag.strip() for tag in tags_elem.text.split(',')] if tags_elem else []
            
            categories = Categories.classify_article(title, tags)
            
            results.append({
                'company': 'Uber',
                'title': title,
                'url': article_url,
                'date': date,
                'tags': tags,
                'categories': categories,
            })
                 
    return results