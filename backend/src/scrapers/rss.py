import feedparser
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlparse
from categories import Categories

def categorize_post(title, content):
    categories = Categories.get_categories()
    text = (title + ' ' + content).lower()
    matched_categories = []
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            matched_categories.append(category)
    return matched_categories

def get_company_from_url(url):
    
    domain = urlparse(url).netloc.lower()
        
    company_mappings = {
        'instagram-engineering.com': 'Instagram',
        'netflixtechblog.com': 'Netflix',
        'blog.developer.adobe.com': 'Adobe',
        'engineering.klarna.com': 'Klarna',
        'engineering.atspotify.com': 'Spotify',
        'engineering.salesforce.com': 'Salesforce',
        'eng.lyft.com': 'Lyft',
        'medium.engineering': 'Medium',
        'dropbox.medium.com': 'Dropbox',
        'medium.com': {
            'airbnb-engineering': 'Airbnb',
            'pinterest-engineering': 'Pinterest',
            'strava-engineering': 'Strava',
            'flutter': 'Flutter',
            '@SlackEng': 'Slack',
            'capital-one-tech': 'Capital One',
            'the-coinbase-blog': 'Coinbase'
        }
    }
    
    if domain in company_mappings:
        if isinstance(company_mappings[domain], dict):
            path = urlparse(url).path.strip('/').split('/')[0]
            return company_mappings[domain].get(path, 'Slack')
        return company_mappings[domain]
    
    return 'Unknown'

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %Z').strftime('%Y-%m-%d')
    except:
        return date_str

def extract_content(content_encoded):
    if not content_encoded:
        return ""
    soup = BeautifulSoup(content_encoded, 'html.parser')
    return soup.get_text(separator=' ', strip=True)

def fetch_articles(feed_url):
    try:
        feed = feedparser.parse(feed_url)
        if feed.entries:
            articles = []
            
            company_name = get_company_from_url(feed_url)
            print(f"\nProcessing {company_name} feed - Found {len(feed.entries)} entries")
            
            for entry in feed.entries:

                author = entry.get('author', '')
                if hasattr(entry, 'dc_creator'):
                    author = entry.dc_creator

                content = ""
                if hasattr(entry, 'content'):
                    content = extract_content(entry.content[0].value)
                elif hasattr(entry, 'content_encoded'):
                    content = extract_content(entry.content_encoded)
                elif hasattr(entry, 'summary'):
                    content = extract_content(entry.summary)

                article_company = get_company_from_url(entry.link)
                categories = categorize_post(entry.title, content)
                
                article_data = {
                    'title': entry.title,
                    'url': entry.link,
                    'author': author,
                    'date': parse_date(entry.published),
                    'categories': categories,
                    'content': content,
                    'company': article_company
                }
                articles.append(article_data)
                
                first_sentence = content.split('.')[0] if content else "No content available."
                print(f"\nTitle: {entry.title}")
                print(f"Company: {article_company}")
                print(f"Author: {author}")
                print(f"Date: {article_data['date']}")
                print(f"Categories: {', '.join(categories)}")
                print(f"URL: {entry.link}")
                print(f"First Sentence: {first_sentence}")
                print("-" * 50)
            
            return articles
    except Exception as e:
        print(f"Error fetching feed {feed_url}: {e}")
        return []

def main():
    feeds = [
        "https://instagram-engineering.com/feed",
        "https://netflixtechblog.com/feed",
        "https://blog.developer.adobe.com/feed",
        "https://medium.com/feed/pinterest-engineering",
        "https://medium.com/feed/strava-engineering",
        "https://medium.com/feed/flutter",
        "https://engineering.klarna.com/feed",
        "https://medium.com/@SlackEng/feed",
        "https://medium.com/feed/airbnb-engineering",
        "https://medium.com/feed/capital-one-tech",
        "https://engineering.atspotify.com/feed/",
        "https://engineering.salesforce.com/feed/",
        "https://eng.lyft.com/feed",
        "https://medium.engineering/feed",
        "https://medium.com/feed/the-coinbase-blog",
        "https://dropbox.medium.com/feed"
    ]
    
    all_articles = []
    
    for feed_url in feeds:
        articles = fetch_articles(feed_url)
        all_articles.extend(articles)
        
    return all_articles

if __name__ == "__main__":
    main()