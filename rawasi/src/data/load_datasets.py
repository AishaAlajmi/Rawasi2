# download_constitution.py
from datasets import load_dataset
import pandas as pd
import os

def download_constitution_dataset():
    print("📥 Downloading Constitution of India dataset...")
    
    try:
        # Load the original Constitution dataset
        dataset = load_dataset("Susant-Achary/constitution-of-india-dataset")
        
        print("✅ Dataset downloaded successfully!")
        print(f"Dataset structure: {dataset}")
        
        # Access the training data
        train_data = dataset['train']
        print(f"Number of constitution articles: {len(train_data)}")
        
        # Convert to pandas DataFrame
        df = train_data.to_pandas()
        
        # Save to CSV file
        csv_path = "constitution_of_india.csv"
        df.to_csv(csv_path, index=False)
        print(f"💾 Saved to CSV: {csv_path}")
        
        # Save to JSON file
        json_path = "constitution_of_india.json"
        df.to_json(json_path, orient='records', indent=2)
        print(f"💾 Saved to JSON: {json_path}")
        
        # Save as plain text file
        txt_path = "constitution_of_india.txt"
        with open(txt_path, 'w', encoding='utf-8') as f:
            for i, row in df.iterrows():
                f.write(f"--- Article {i+1} ---\n")
                f.write(row['text'] + "\n\n")
        print(f"💾 Saved to TXT: {txt_path}")
        
        # Display some statistics
        print(f"\n📊 Dataset Statistics:")
        print(f"Total articles: {len(df)}")
        print(f"Total characters: {df['text'].str.len().sum()}")
        print(f"Average article length: {df['text'].str.len().mean():.0f} characters")
        
        # Show first few articles
        print(f"\n📖 First 3 articles preview:")
        for i in range(min(3, len(df))):
            text = df.iloc[i]['text']
            preview = text[:200] + "..." if len(text) > 200 else text
            print(f"\nArticle {i+1}:")
            print(f"  {preview}")
            
        return df
        
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        return None

if __name__ == "__main__":
    download_constitution_dataset()