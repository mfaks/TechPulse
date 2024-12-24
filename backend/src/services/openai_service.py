import openai
import os
from typing import List, Dict
from kafka import KafkaConsumer, KafkaProducer
import json
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))


async def summarize_articles(articles: List[Dict]) -> str:
    if not articles:
        return "There were no articles matching your requested feed. Please try again later or with a different set of topics or companies."

    article_summaries = []
    for article in articles:
        summary = f"Title: {article['title']}\n"
        summary += f"Company: {article['company']}\n"
        summary += f"Categories: {article['categories']}\n"
        summary += f"Content: {article.get('content', 'No content available')[:500]}...\n\n"
        article_summaries.append(summary)

    prompt = (
        "You are a tech news curator creating an engaging, visually formatted summary. Follow these formatting guidelines:\n\n"
        
        "1. TITLES AND HEADERS:\n"
        "- For each article:\n"
        "  * Format title as '### [Title]' centered and use **bold** to bold them\n"
        "  * On the next line, format categories as '### (_Category1_ | _Category2_ | _Category3_)' centered\n"
        "  * Skip categories marked as 'Other'\n"
        "- Add one blank line after headers\n\n"
        
        "2. CONTENT STRUCTURE:\n"
        "- Break summaries into clear paragraphs\n"
        "- Use **bold** for important findings, metrics, and technical terms\n"
        "- Add one blank line after each article summary\n"
        "- Add horizontal rule (---) between articles\n\n"
    
        "3. SUMMARY FOCUS:\n"
        "- Emphasize technical details and implementations\n"
        "- Include specific technologies mentioned\n"
        "- Highlight performance metrics and benchmarks\n"
        "- Each Summary should be one paragraph consisting of at least 100 words\n"
        "- Note technical challenges and solutions\n\n"
        
        f"Articles:\n{''.join(article_summaries)}"
    )

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional tech news curator and summarizer."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500,
        temperature=0.7
    )
    return response.choices[0].message.content


async def main():
    while True:
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
