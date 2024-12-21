import requests
from bs4 import BeautifulSoup
from .categories import Categories

def get_articles():
    results = []
    url = "https://www.databricks.com/blog"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all('article', {'data-cy': 'Teaser'})
        
        for article in articles:
            title_elem = article.find('h2')
            if not title_elem:
                print("No title element found, skipping article")
                continue
                
            link_elem = title_elem.find('a')
            if not link_elem:
                print("No link element found, skipping article")
                continue
                
            author_elem = article.find('div', class_='blog-authors-styles')
            date_elem = author_elem.text.split('by')[0].strip() if author_elem else ''
            author_name = author_elem.text.split('by')[1].strip() if author_elem and 'by' in author_elem.text else 'Unknown'

            title = link_elem.text.strip()
            link = f"https://www.databricks.com{link_elem['href']}"
            content = article.find('div', class_='clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item').text.strip() if article.find('div', class_='clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item') else ''
            categories = Categories.classify_article(title)
            
            results.append({
                'title': title,
                'url': link,
                'content': content,
                'author': author_name,
                'date': date_elem,
                'categories': categories,
                'company': 'Databricks'
            })
                
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

    return results