import os
from dotenv import load_dotenv

load_dotenv()

S3_ENDPOINT = 'https://schnitt-ai.s3.amazonaws.com/'
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = 'us-east-1'
AWS_BUCKET_NAME = 'schnitt-ai'
