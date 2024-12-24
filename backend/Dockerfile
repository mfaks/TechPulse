FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x src/aws/init.sh

EXPOSE 8000

CMD ["sh", "-c", "./src/aws/init.sh && uvicorn src.main:app --host 0.0.0.0 --port 8000"]