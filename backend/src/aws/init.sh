#!/bin/bash
set -e

echo "Waiting for LocalStack to be ready..."
while ! nc -z localstack 4566; do
  sleep 1
done
echo "LocalStack is ready!"

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-east-1
export LOCALSTACK=http://localstack:4566

python src/aws/create_table.py
python src/aws/deploy_lambda.py