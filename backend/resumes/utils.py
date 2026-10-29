import fitz
from docx import Document

def extract_resume_text(file_path):
    file_path = str(file_path)

    if file_path.lower().endwith(".pdf"):
        text = []

        with fitz.open(file_path) as pdf:
            for page in pdf:
                text.append(page.get_text())
                
        return "\n".join(text).strip()
    
    elif file_path.lower().endwith(".docx"):
        document = Document(file_path)

        paragraph = [
            paragraph.text
            for paragraph in document.paragraphs
        ]
        return "\n".join(paragraphs).strip()

    raise ValueError("Only PDF and DOCX files are supported.")