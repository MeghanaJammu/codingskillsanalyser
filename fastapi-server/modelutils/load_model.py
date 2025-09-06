import torch
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSequenceClassification,  AutoModelForSeq2SeqLM

# Loading environment variables from .env file
load_dotenv()

#any env variable is accesible but for us accesstoken is needed
access_token = os.getenv("HF_TOKEN")

model_name= "somrima0907/model_codeT5"

tokenizer = AutoTokenizer.from_pretrained(model_name, token=access_token)
model = AutoModelForSequenceClassification.from_pretrained(model_name, token=access_token)

# Save locally after first load
save_folder = "./saved_model_codeT5_loaded"

# Create folder if it doesn't exist
os.makedirs(save_folder, exist_ok=True)

# Save tokenizer and model locally
tokenizer.save_pretrained(save_folder)
model.save_pretrained(save_folder)