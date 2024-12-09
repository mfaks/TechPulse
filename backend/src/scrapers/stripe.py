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
    url = "https://stripe.com/blog/engineering"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all('article', {'class': 'BlogIndexPost'})
        
        for article in articles:
            title_elem = article.find('h1', class_='BlogIndexPost__title')
            title_link = title_elem.find('a') if title_elem else None
            title = title_link.text.strip() if title_link else 'Unknown Title'
            
            link = f"https://stripe.com{title_link['href']}" if title_link else ''
            
            date_elem = article.find('time', class_='BlogPostDate')
            date = date_elem.find('a').text.strip() if date_elem and date_elem.find('a') else 'Unknown Date'
            
            authors = []
            author_list = article.find('div', class_='BlogIndexPost__authorList')
            if author_list:
                for author in author_list.find_all('figure', class_='BlogAuthor'):
                    author_name = author.find('a', class_='BlogAuthor__link')
                    author_role = author.find('span', class_='BlogAuthor__role')
                    if author_name and author_role:
                        authors.append(f"{author_name.text.strip()} ({author_role.text.strip()})")
            
            content_elem = article.find('div', class_='BlogIndexPost__body')
            content = content_elem.text.strip() if content_elem else ''
            
            categories = categorize_post(title)
            
            print(f"Title: {title}")
            print(f"Company: Stripe")
            print(f"Author: {' | '.join(authors) if authors else 'Unknown Author'}")
            print(f"Date: {date}")
            print(f"Categories: {', '.join(categories)}")
            print(f"Link: {link}")
            print(f"Content length: {len(content)} characters")
            print("-" * 50)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
    except Exception as e:
        print(f"Error processing content: {e}")

if __name__ == "__main__":
    get_and_print_articles()