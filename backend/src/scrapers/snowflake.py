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
                
                categories = categorize_post(title)
                
                print(f"Title: {title}")
                print(f"Date: {date}")
                print(f"Link: {link}")
                print(f"Categories: {', '.join(categories)}")
                print(f"Description: {description}")
                print("-" * 80)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    get_and_print_articles()
