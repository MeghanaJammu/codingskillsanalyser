from huggingface_hub import upload_folder

# Replace with your folder and repo
local_model_path = r"C:/Users/somri/Downloads/CODE FEEDBACK/model_codeT5"
repo_id = "somrima0907/model_codeT5"

import os

access_token = os.environ.get("HUGGINGFACE_TOKEN2")

upload_folder(
    folder_path=local_model_path,
    repo_id=repo_id,
    repo_type="model",
    token=token,
    ignore_patterns=["*.pyc", "__pycache__"]
)

print(f"Model uploaded successfully: https://huggingface.co/{repo_id}")