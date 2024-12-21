import requests
from bs4 import BeautifulSoup
from .categories import Categories

def get_articles():
    base_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }

    google_urls = [
        "https://developers.googleblog.com/en/search/?technology_categories=AI",
        "https://developers.googleblog.com/en/search/?technology_categories=Web",
        "https://developers.googleblog.com/en/search/?technology_categories=Cloud",
        "https://developers.googleblog.com/en/search/?technology_categories=Mobile"
    ]

    results = []

    for url in google_urls:
        try:
            response = requests.get(url, headers=base_headers, timeout=30)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')
            search_results = soup.find_all('li', class_='search-result')

            for result in search_results:
                title_elem = result.find('h3', class_='search-result__title')
                link_elem = title_elem.find('a') if title_elem else None
                summary_elem = result.find('p', class_='search-result__summary')
                date_elem = result.find('p', class_='search-result__eyebrow')

                if link_elem:
                    title = title_elem.text.strip()
                    relative_url = link_elem['href']
                    full_url = f"https://developers.googleblog.com{relative_url}"
                    summary = summary_elem.text.strip() if summary_elem else ''

                    date_text = date_elem.text.strip() if date_elem else 'Unknown'
                    date = date_text.split('/')[0].strip()

                    matched_categories = Categories.classify_article(title, summary)

                    results.append({
                        'company': 'Google',
                        'title': title,
                        'summary': summary,
                        'date': date,
                        'categories': matched_categories,
                        'url': full_url
                    })
                           
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
    
    return results