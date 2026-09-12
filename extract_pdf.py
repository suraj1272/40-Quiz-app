import pypdf
import json

reader = pypdf.PdfReader('TTS Set D.pdf')
print(f"Total pages: {len(reader.pages)}")

full_text = []
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    full_text.append(f"=== PAGE {i+1} ===\n" + (text if text else ""))

with open("extracted_pdf_text.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(full_text))

print("Successfully extracted text to extracted_pdf_text.txt")
