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
    url = "https://www.notion.so/blog"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all('article', class_='post-preview')
        
        for article in articles:
            title_elem = article.find('h3')
            link_elem = title_elem.find('a') if title_elem else None
            title = title_elem.get_text().strip() if title_elem else "No title"
            
            link = f"https://www.notion.so{link_elem['href']}" if link_elem else ""
            
            author_container = article.find('div', class_='UserBaseInfo_textInfoContainer__JNjgO')
            author_name = author_container.find('p').get_text().strip() if author_container else "Unknown"
            author_title = author_container.find_all('p')[1].get_text().strip() if (author_container and len(author_container.find_all('p')) > 1) else ""
            
            content_elem = article.find('a', class_='postPreview_subtitle__9cBhQ')
            content = content_elem.get_text().strip() if content_elem else ""
            
            categories = categorize_post(title)
            
            print(f"Title: {title}")
            print(f"Author: {author_name}")
            print(f"Author Title: {author_title}")
            print(f"Link: {link}")
            print(f"Categories: {', '.join(categories)}")
            print(f"Content Preview: {content}")
            print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    get_and_print_articles()