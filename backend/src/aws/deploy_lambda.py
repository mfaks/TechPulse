import boto3
import json
from pathlib import Path
import zipfile
import io
import os 

AWS_REGION = os.getenv('AWS_REGION')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
LOCALSTACK = os.getenv('LOCALSTACK')

def deploy_lambda():
    lambda_client = boto3.client('lambda',
        endpoint_url=LOCALSTACK,
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        lambda_file = Path(__file__).parent / 'lambda_to_dynamodb.py'
        zip_file.write(lambda_file, 'lambda_to_dynamodb.py')

    zip_buffer.seek(0)
    zip_content = zip_buffer.read()

    try:
        lambda_client.create_function(
            FunctionName='lambda_to_dynamodb',
            Runtime='python3.11',
            Role='arn:aws:iam::000000000000:role/lambda-role',
            Handler='lambda_to_dynamodb.populate_dynamodb',
            Code={'ZipFile': zip_content},
            Timeout=30
        )
    except Exception as e:
        print("Error creating Lambda function:", e)

if __name__ == "__main__":
    deploy_lambda() 