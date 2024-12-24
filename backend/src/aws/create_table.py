import boto3
import os 

LOCALSTACK = os.getenv('LOCALSTACK')
AWS_REGION = os.getenv('AWS_REGION')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

def create_dynamodb_table():
    dynamodb = boto3.client('dynamodb',
        endpoint_url=LOCALSTACK,
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    
    try:
        dynamodb.create_table(
            TableName='TechPulse',
            AttributeDefinitions=[
                {
                    'AttributeName': 'article_id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'company',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'date',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'categories',
                    'AttributeType': 'S'
                }
            ],
            KeySchema=[
                {
                    'AttributeName': 'article_id',
                    'KeyType': 'HASH'
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'CompanyDateIndex',
                    'KeySchema': [
                        {
                            'AttributeName': 'company',
                            'KeyType': 'HASH'
                        },
                        {
                            'AttributeName': 'date',
                            'KeyType': 'RANGE'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                },
                {
                    'IndexName': 'CategoryDateIndex',
                    'KeySchema': [
                        {
                            'AttributeName': 'categories',
                            'KeyType': 'HASH'
                        },
                        {
                            'AttributeName': 'date',
                            'KeyType': 'RANGE'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        return True
        
    except Exception as e:
        print(f"Error creating table: {str(e)}")
        return False


if __name__ == "__main__":
    create_dynamodb_table() 