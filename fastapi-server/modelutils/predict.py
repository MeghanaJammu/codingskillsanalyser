import torch
import os
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSequenceClassification


load_dotenv()

# Paths
save_folder = "./saved_model_codeT5_loaded"
model_name = "somrima0907/model_codeT5"
access_token = os.getenv("HF_TOKEN")

# Load from local if available, else download
if os.path.exists(save_folder) and os.listdir(save_folder):
    print("Loading model from local folder...")
    tokenizer = AutoTokenizer.from_pretrained(save_folder)
    model = AutoModelForSequenceClassification.from_pretrained(save_folder)
else:
    print("Downloading model from Hugging Face...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, token=access_token)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, token=access_token)
    os.makedirs(save_folder, exist_ok=True)
    tokenizer.save_pretrained(save_folder)
    model.save_pretrained(save_folder)

# Setting model to evaluation mode
model.eval()
print("Model and tokenizer loaded successfully!")

id2label = {0:"O(1)", 1:"O(n^3)", 2:"O(n)", 3:"O(2^n)", 4:"O(n^2)"}

def predict_tc(code_snippet):
    inputs = tokenizer(code_snippet, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    pred_id = torch.argmax(logits, dim=-1).item()
    return id2label[pred_id]
