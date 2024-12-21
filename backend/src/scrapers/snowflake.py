import requests
from bs4 import BeautifulSoup
from .categories import Categories

def get_articles():
    results = []
    url = "https://www.snowflake.com/engineering-blog/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.snowflake.com/',
        'Connection': 'keep-alive'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        posts = soup.find_all('div', class_='m-blog-latest-posts__post')

        for post in posts:
            title_elem = post.find('h3', class_='post-title')
            link_elem = post.find('a', class_='post-link')
            date_elem = post.find('span', class_='post-date')
            description_elem = post.find('p', class_='post-description')

            if title_elem and link_elem:
                title = title_elem.text.strip()
                link = link_elem['href']
                date = date_elem.text.strip() if date_elem else 'Unknown'
                description = description_elem.text.strip() if description_elem else 'No description available.'
                
                categories = Categories.classify_article(title)
                
                results.append({
                    'company': 'Snowflake',
                    'title': title,
                    'description': description,
                    'date': date,
                    'categories': categories,
                    'url': link
                })
        
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

    return results
