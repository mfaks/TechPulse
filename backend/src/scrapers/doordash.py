import requests
from bs4 import BeautifulSoup
from categories import Categories

def get_articles():
    results = []
    base_urls = [
        "https://careersatdoordash.com/engineering-blog/?category=AI%20%26%20ML",
        "https://careersatdoordash.com/engineering-blog/?category=Data",
        "https://careersatdoordash.com/engineering-blog/?category=Backend", 
        "https://careersatdoordash.com/engineering-blog/?category=Mobile",
        "https://careersatdoordash.com/engineering-blog/?category=Web"
    ]
    
    for url in base_urls:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        article_elements = soup.find_all('div', {'class': 'fade'})
        
        for article in article_elements:

            title_elem = article.find('h3', class_='text-md')
            title = title_elem.text.strip() if title_elem else 'Unknown Title'
            
            link_elem = article.find('a')
            link = link_elem['href'] if link_elem else ''
            
            categories_div = article.find('div', class_='flex items-center flex-wrap mb-4 gap-2')
            article_categories = []
            if categories_div:
                category_tags = categories_div.find_all('div', class_='bg-stone-2')
                article_categories = [tag.text.strip() for tag in category_tags]
            
            content_elem = article.find('div', class_='text-sm text-stone')
            content = content_elem.text.strip() if content_elem else ''
            categories = Categories.classify_article(title, article_categories)
            
            results.append({
                'title': title,
                'url': link,
                'content': content,
                'categories': categories,
                'company': 'DoorDash'
            })

    return results