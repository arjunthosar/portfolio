import os
import json
from PIL import Image

# Paths
image_dir = "C:\\Users\\arjun\\Documents\\Coding Stuff\\portfolio\\public\\assets\\gallery"
json_file = "image_categories.json"

# Load existing JSON
with open(json_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# If it's a dict of {filename: {...}}, adjust accordingly
if isinstance(data, dict):
    for filename, info in data.items():
        filepath = os.path.join(image_dir, filename)
        if os.path.exists(filepath):
            try:
                with Image.open(filepath) as img:
                    width, height = img.size
                    info["width"] = width
                    info["height"] = height
            except Exception as e:
                print(f"Error processing {filename}: {e}")
elif isinstance(data, list):
    for entry in data:
        filename = entry.get("filename")
        if not filename:
            continue
        filepath = os.path.join(image_dir, filename)
        if os.path.exists(filepath):
            try:
                with Image.open(filepath) as img:
                    width, height = img.size
                    entry["width"] = width
                    entry["height"] = height
            except Exception as e:
                print(f"Error processing {filename}: {e}")

# Save updated JSON
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

print("Updated JSON file with width and height.")
