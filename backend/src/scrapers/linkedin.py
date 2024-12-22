import requests
from bs4 import BeautifulSoup
from categories import Categories

def categorize_article(title, content):
    categories = Categories.get_categories()
    text = (title + ' ' + content).lower()
    matched_categories = []
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            matched_categories.append(category)
    return matched_categories

def get_articles():
    results = []
    endpoints = [
        "https://www.linkedin.com/blog/engineering/data",
        "https://www.linkedin.com/blog/engineering/artificial-intelligence",
        "https://www.linkedin.com/blog/engineering/infrastructure",
        "https://www.linkedin.com/blog/engineering/trust-and-safety",
        "https://www.linkedin.com/blog/engineering/product-design"
    ]
    
    base_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }

    try:
        for endpoint in endpoints:
            response = requests.get(endpoint, headers=base_headers, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')
            ul_element = soup.find('ul', class_='grid-layout__posts')
            if ul_element is None:
                print(f"No articles found on {endpoint}. Check the HTML structure or class names.")
                continue

            article_elements = ul_element.find_all('li', class_='post-list__item grid-post')

            for article in article_elements:
                title_elem = article.find('div', class_='grid-post__title')
                link_elem = title_elem.find('a') if title_elem else None
                author_elem = article.find('p', class_='grid-post__author')
                date_elem = article.find('p', class_='grid-post__date')
                
                if link_elem:
                    title = link_elem.text.strip()
                    content = article.find('div', class_='grid-post__content').text.strip() if article.find('div', class_='grid-post__content') else ''
                    categories = categorize_article(title, content)
                    
                    results.append({
                        'company': 'LinkedIn',
                        'title': title,
                        'content': content,
                        'author': author_elem.text.strip() if author_elem else 'Unknown',
                        'date': date_elem.text.strip() if date_elem else 'Unknown',
                        'categories': categories,
                        'url': link_elem['href']
                    })
                       
    except requests.RequestException as e:
        print(f"Error fetching articles: {e}")

    return results