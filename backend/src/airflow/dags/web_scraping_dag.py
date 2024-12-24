import sys
import traceback
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.operators.lambda_function import LambdaInvokeFunctionOperator
from datetime import datetime, timedelta
import json
import importlib
import boto3
import os

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
LOCALSTACK = os.getenv('LOCALSTACK')

aws_conn_config = {
    'aws_access_key_id': AWS_ACCESS_KEY_ID,
    'aws_secret_access_key': AWS_SECRET_ACCESS_KEY,
    'region_name': AWS_REGION,
    'endpoint_url': LOCALSTACK
}

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'web_scraping_dag',
    default_args=default_args,
    description='Production web scraping pipeline',
    schedule_interval='@daily',
    catchup=False
)

def scrape_to_lambda():
    scrapers_folder = '/opt/airflow/scrapers'

    if scrapers_folder not in sys.path:
        sys.path.append(scrapers_folder)

    data = []
    seen_titles = set()
    companies_scraped = set()

    for filename in os.listdir(scrapers_folder):
        if filename.endswith('.py') and filename not in ['__init__.py', 'categories.py']:
            module_path = os.path.join(scrapers_folder, filename)
            
            spec = importlib.util.spec_from_file_location(
                f"scrapers.{filename[:-3]}", 
                module_path
            )
            
            module = importlib.util.module_from_spec(spec)
            sys.modules[module.__name__] = module
            spec.loader.exec_module(module)
            
            if hasattr(module, 'get_articles'):
                scraped_data = module.get_articles()
                if scraped_data:
                    for article in scraped_data:
                        if article['title'] not in seen_titles:
                            seen_titles.add(article['title'])
                            data.append(article)
                            companies_scraped.add(article['company'])

    return json.dumps({'body': data})
    
scrape_task = PythonOperator(
    task_id='scrape_articles',
    python_callable=scrape_to_lambda,
    dag=dag,
)

trigger_lambda = LambdaInvokeFunctionOperator(
    task_id='trigger_lambda_consumer',
    function_name='lambda_to_dynamodb',
    payload="{{ task_instance.xcom_pull(task_ids='scrape_articles') }}",
    aws_conn_id='aws_default',
    region_name=AWS_REGION,
    dag=dag,
)

scrape_task >> trigger_lambda