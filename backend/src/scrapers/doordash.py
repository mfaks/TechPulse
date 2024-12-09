import requests
from bs4 import BeautifulSoup
from categories import Categories

def categorize_post(title, article_categories):
    categories = Categories.get_categories()
    matched_categories = []
    text_to_check = f"{title} {' '.join(article_categories)}".lower()
    for category, keywords in categories.items():
        if any(keyword in text_to_check for keyword in keywords):
            matched_categories.append(category)
    return matched_categories

def get_and_print_articles():
    base_urls = [
        "https://careersatdoordash.com/engineering-blog/?category=AI%20%26%20ML",
        "https://careersatdoordash.com/engineering-blog/?category=Data",
        "https://careersatdoordash.com/engineering-blog/?category=Backend", 
        "https://careersatdoordash.com/engineering-blog/?category=Mobile",
        "https://careersatdoordash.com/engineering-blog/?category=Web"
    ]
    
    try:
        for url in base_urls:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = soup.find_all('div', {'class': 'fade'})
            
            for article in articles:

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

                categories = categorize_post(title, article_categories)
                
                print(f"Title: {title}")
                print(f"Link: {link}")
                print(f"Categories: {', '.join(categories)}")
                print(f"Content: {content}")
                print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching content: {e}")
    except Exception as e:
        print(f"Error processing content: {e}")

if __name__ == "__main__":
    get_and_print_articles()