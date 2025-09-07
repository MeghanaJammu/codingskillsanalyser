from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_path = "./my_model_T5"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
model.eval()