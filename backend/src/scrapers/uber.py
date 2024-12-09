import requests
from bs4 import BeautifulSoup
from categories import Categories

def categorize_post(title, tags):
    categories = Categories.get_categories()
    text = (title + ' ' + ' '.join(tags)).lower()
    matched_categories = []
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            matched_categories.append(category)
    return matched_categories

def get_and_print_articles():
    url = "https://www.uber.com/blog/portland/engineering/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }
    
    try:
        print("Fetching Uber engineering blog articles...\n")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        categories_dict = {}
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
                
                categories = categorize_post(title, tags)
                
                for category in categories:
                    if category not in categories_dict:
                        categories_dict[category] = []
                    categories_dict[category].append({
                        'title': title,
                        'url': article_url,
                        'date': date,
                        'tags': tags,
                        'categories': categories,
                        'company': 'Uber'
                    })
        
        for category, articles in categories_dict.items():
            print(f"Category: {category}")
            for article in articles:
                print(f"Title: {article['title']}")
                print(f"Date: {article['date']}")
                print(f"Tags: {', '.join(article['tags'])}")
                print(f"Categories: {', '.join(article['categories'])}")
                print(f"Link: {article['url']}")
                print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    get_and_print_articles()