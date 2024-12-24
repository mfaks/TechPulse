import json
import boto3
from datetime import datetime
import uuid

def populate_dynamodb(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('TechPulse')
    
    if isinstance(event['body'], str):
        articles = json.loads(event['body'])
    else:
        articles = event['body']
        
    success_count = 0
    today = datetime.now().strftime('%Y-%m-%d')
    
    with table.batch_writer() as batch:
        for item in articles:
            categories = item.get('categories', ['Uncategorized'])
            if not categories:
                categories = ['Uncategorized']
                
            formatted_item = {
                'article_id': str(uuid.uuid4()),
                'company': item['company'],
                'date': item.get('date', today),
                'title': item.get('title', ''),
                'url': item.get('url', ''),
                'content': item.get('content', ''),
                'author': item.get('author', ''),
                'categories': ','.join(categories)
            }
            
            batch.put_item(Item=formatted_item)
            success_count += 1
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Successfully processed {success_count} articles',
            'success_count': success_count
        })
    }