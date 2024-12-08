import requests
from bs4 import BeautifulSoup
from categories import Categories

def categorize_post(title):
    categories = Categories.get_categories()
    matched_categories = []
    for category, keywords in categories.items():
        if any(keyword in title.lower() for keyword in keywords):
            matched_categories.append(category)
    
    return matched_categories

def get_and_print_articles():
    url = "https://www.databricks.com/blog"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all('article', {'data-cy': 'Teaser'})
        
        for article in articles:
            title_elem = article.find('h2')
            link_elem = title_elem.find('a') if title_elem else None
            author_elem = article.find('div', class_='blog-authors-styles')
            date_elem = author_elem.text.split('by')[0].strip() if author_elem else ''
            author_name = author_elem.text.split('by')[1].strip() if author_elem and 'by' in author_elem.text else 'Unknown'

            if link_elem:
                title = link_elem.text.strip()
                link = f"https://www.databricks.com{link_elem['href']}"
                content = article.find('div', class_='clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item').text.strip() if article.find('div', class_='clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item') else ''
                
                categories = categorize_post(title)
                
                print(f"Title: {title}")
                print(f"Author: {author_name}")
                print(f"Date: {date_elem}")
                print(f"Link: {link}")
                print(f"Categories: {', '.join(categories)}")
                print(f"Content: {content}")
                print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    get_and_print_articles()