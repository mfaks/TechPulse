import requests
from bs4 import BeautifulSoup
from categories import Categories

def categorize_post(title, content):
    categories = Categories.get_categories()
    text = (title + ' ' + content).lower()
    matched_categories = []
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            matched_categories.append(category)
    return matched_categories

def get_and_print_articles():
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

    articles = []

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

                    matched_categories = categorize_post(title, summary)

                    articles.append({
                        'title': title,
                        'url': full_url,
                        'summary': summary,
                        'date': date,
                        'categories': matched_categories
                    })

        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")

    for article in articles:
        print(f"Title: {article['title']}")
        print(f"URL: {article['url']}")
        print(f"Summary: {article['summary']}")
        print(f"Date: {article['date']}")
        print(f"Categories: {', '.join(article['categories'])}")
        print("-" * 80)

if __name__ == "__main__":
    get_and_print_articles()
