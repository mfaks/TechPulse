import importlib
import json
import boto3
from botocore.exceptions import ClientError
import uuid

def populate_dynamodb(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('TechPulse')
    
    try:
        if isinstance(event['body'], str):
            articles = json.loads(event['body'])
        else:
            articles = event['body']
            
        success_count = 0
        failed_items = []
        
        with table.batch_writer() as batch:
            for item in articles:
                try:
                    item['id'] = str(uuid.uuid4())
                    batch.put_item(Item=item)
                    success_count += 1
                except Exception as e:
                    failed_items.append({
                        'item': item,
                        'error': str(e)
                    })
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Successfully processed {success_count} articles',
                'success_count': success_count,
                'failed_count': len(failed_items),
                'failed_items': failed_items
            })
        }
        
    except Exception as e:
        print(f"Error processing articles: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }