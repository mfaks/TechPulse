import feedparser
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlparse
from .categories import Categories

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
            path = urlparse(url).path.strip('/').replace('feed/', '', 1).split('/')[0]
            return company_mappings[domain].get(path, 'Unknown')
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

def get_articles():
    results = []
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
    
    for feed_url in feeds:
        try:
            feed = feedparser.parse(feed_url)
            company = get_company_from_url(feed_url)
            for entry in feed.entries:
                try:
                    content = ""
                    if hasattr(entry, 'content'):
                        content = extract_content(entry.content[0].value)
                    elif hasattr(entry, 'content_encoded'):
                        content = extract_content(entry.content_encoded)
                    elif hasattr(entry, 'summary'):
                        content = extract_content(entry.summary)

                    author = entry.get('author', '')
                    if hasattr(entry, 'dc_creator'):
                        author = entry.dc_creator

                    results.append({
                        'company': company,
                        'title': entry.title,
                        'url': entry.link,
                        'content': content,
                        'author': author,
                        'date': parse_date(entry.published),
                        'categories': Categories.classify_article(entry.title, [])
                    })
                    
                except Exception as e:
                    print(f"Error processing entry from {company}: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error fetching feed {feed_url}: {str(e)}")
            continue
    
    return results