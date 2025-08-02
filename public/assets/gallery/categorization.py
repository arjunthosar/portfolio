import json
import os
# import google.generativeai as client
from google import genai

with open("api.env", "r") as file:
    api_key = file.read().strip()

# client.configure(api_key=api_key)

client = genai.Client(api_key=api_key)

image_uris = []
# Sort the files by number (1.jpg, 2.jpg, etc)
# before going through them
filenames = sorted([filename for filename in os.listdir("./") if filename.lower().endswith((".jpg", ".jpeg", ".png"))], key=lambda x: int(''.join(filter(str.isdigit, x))))

for filename in filenames:
    filepath = filename
    uploaded_file = client.files.upload(file=filepath)

    image_uris.append({
        "filename": filename,
        "file_id": uploaded_file
    })

print(image_uris)

prompt = (
    "Categorize each of the following images as exactly one of: "
    "city, nature, portraits, or other."
    "City: Any picture of a city, street, or building."
    "Nature: Any picture of nature, animals, or plants, including birds, squirrels, chipmunks, trees, or flowers. Portraits of animals count as nature."
    "Portraits: Any picture of a person. where the focus of the picture is on that person."
    "Other: Any picture that does not fit the other categories.\n\n"
    "Return ONLY a JSON array of objects, in the form:\n"
    "[ {\"filename\": \"filename.jpg\", \"category\": \"city\"}, ... ]"
)
contents = [prompt]
for obj in image_uris:
    # In the contents array, you can interleave file + filename text for context
    contents.append(obj["filename"])
    contents.append(obj["file_id"])

print(contents)

# # 3. Make the API call to classify
model_id = "gemini-2.5-flash"
response = client.models.generate_content(
    model=model_id,
    contents=contents
)

output_text = response.text.strip()

try:
    json_data = json.loads(output_text)
    with open("image_categories.json", "w") as f:
        json.dump(json_data, f, indent=2)
    print("✅ Categorized JSON saved to image_categories.json!")
except json.JSONDecodeError:
    print("❌ Gemini's response couldn't be parsed as JSON:")
    print(output_text)

# from google import genai

# with open("api.env", "r") as file:
#     api_key = file.read().strip()

# client = genai.Client(api_key=api_key)

# my_file = client.files.upload(file="gallery1.jpg")
# my_file2 = client.files.upload(file="gallery2.jpg")

# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents=["Caption these images, including their filenames as titles.", "gallery1.jpg", my_file, "gallery2.jpg", my_file2],
# )

# print(response.text)