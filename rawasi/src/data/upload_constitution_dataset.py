# upload_constitution_dataset.py
from datasets import Dataset, DatasetDict
from huggingface_hub import HfApi
import pandas as pd

def upload_constitution_dataset():
    # Your repository ID - use your username
    repo_id = "aiisha/constitution-of-india-dataset"
    
    api = HfApi()
    
    # Create the repository
    try:
        api.create_repo(
            repo_id=repo_id,
            repo_type="dataset",
            private=False,  # Set to True if you want it private
            exist_ok=True   # If repo exists, don't error
        )
        print(f"✅ Repository created: {repo_id}")
    except Exception as e:
        print(f"ℹ️ Repository note: {e}")
    
    # Create sample constitution data (you would replace this with your actual data)
    # Since you have the actual dataset, you would load it here
    constitution_data = [
        {
            "text": "PART IX THE TERRITORIES IN PART D OF THE FIRST SCHEDULE AND OTHER TERRITORIES NOT SPECIFIED IN THAT SCHEDULE 243 Administration of territories specified in PART D of the First Schedule and other territories not specified in that Schedule (1) Any territory specified in Part D of the First Schedule and any Other territory COm- prised within the territory of India but not specified in that Schedule shall be administered by the President acting, to such extent as he thinks fit, through a Chief Commissioner or other authority to be appointed by him.",
            "part": "IX",
            "article": "243",
            "type": "administration"
        },
        {
            "text": "PART X THE SCHEDULED AND TRIBAL AREAS 244. Administration of Scheduled Areas and tribal areas.—(1) The provisions of the Fifth Schedule shall apply to the administration and control of the Scheduled Areas and Scheduled Tribes in any State specified in Part A or Part B of the First Schedule other than the States of Assam.",
            "part": "X", 
            "article": "244",
            "type": "administration"
        },
        {
            "text": "PART XIII TRADE, COMMERCE AND INTERCOURSE WITHIN THE TERRITORY OF INDIA 301. Freedom of trade, commerce and intercourse.—Subject to the other provisions of this Part, trade, commerce and intercourse throughout the territory of India shall be free.",
            "part": "XIII",
            "article": "301", 
            "type": "trade_commerce"
        }
    ]
    
    # Create dataset
    dataset = Dataset.from_pandas(pd.DataFrame(constitution_data))
    
    # Create dataset dictionary
    dataset_dict = DatasetDict({
        "train": dataset
    })
    
    # Push to Hub
    print("📤 Uploading Constitution of India dataset...")
    dataset_dict.push_to_hub(repo_id)
    
    print(f"✅ Dataset uploaded successfully!")
    print(f"🔗 View your dataset at: https://huggingface.co/datasets/{repo_id}")
    return repo_id

if __name__ == "__main__":
    upload_constitution_dataset()