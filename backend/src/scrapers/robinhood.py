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
    base_urls = [
        "https://newsroom.aboutrobinhood.com/category/engineering/",
        "https://newsroom.aboutrobinhood.com/category/engineering/page/2/",
        "https://newsroom.aboutrobinhood.com/category/engineering/page/3/"
    ]
    
    try:
        for url in base_urls:
            print(f"\nFetching articles from {url}\n")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = soup.find_all('div', {'class': 'frontpage-post-box'})
            
            for article in articles:
                title_elem = article.find('h4')
                title = title_elem.text.strip() if title_elem else 'Unknown Title'
                
                link_elem = article.find('a')
                link = link_elem['href'] if link_elem else ''
                
                date_elem = article.find('time', class_='entry-date')
                date = date_elem.text.strip() if date_elem else ''
                
                author_elem = article.find('a', class_='author')
                author = author_elem.text.strip() if author_elem else 'Unknown Author'
                
                excerpt_elem = article.find('div', class_='frontpage-post-excerpt')
                excerpt = excerpt_elem.text.strip() if excerpt_elem else ''
                
                
                categories = categorize_post(title)
                
                print(f"Title: {title}")
                print(f"Author: {author}")
                print(f"Date: {date}")
                print(f"Link: {link}")
                print(f"Categories: {', '.join(categories)}")
                print(f"Excerpt: {excerpt}")
                print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching content: {e}")
    except Exception as e:
        print(f"Error processing content: {e}")

if __name__ == "__main__":
    get_and_print_articles()