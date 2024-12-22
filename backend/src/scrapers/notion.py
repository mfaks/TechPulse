import requests
from bs4 import BeautifulSoup
from categories import Categories

def get_articles():
    results = []
    url = "https://www.notion.so/blog"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    article_elements = soup.find_all('article', class_='post-preview')
    
    for article in article_elements:
        title_elem = article.find('h3')
        link_elem = title_elem.find('a') if title_elem else None
        title = title_elem.get_text().strip() if title_elem else "No title"
        
        link = f"https://www.notion.so{link_elem['href']}" if link_elem else ""
        
        author_container = article.find('div', class_='UserBaseInfo_textInfoContainer__JNjgO')
        author_name = author_container.find('p').get_text().strip() if author_container else "Unknown"
        author_title = author_container.find_all('p')[1].get_text().strip() if (author_container and len(author_container.find_all('p')) > 1) else ""
        
        content_elem = article.find('a', class_='postPreview_subtitle__9cBhQ')
        content = content_elem.get_text().strip() if content_elem else ""
        categories = Categories.classify_article(title)
        
        results.append({
            'company': 'Notion',
            'title': title,
            'content': content,
            'author': author_name,
            'author_title': author_title,
            'categories': categories,
            'url': link,
        })
            
    return results