from openai import OpenAI
from fastapi import UploadFile
from PyPDF2 import PdfReader
from latex import build_pdf
from pathlib import Path

class ExamGenerator:
    def __init__(self):
        self.system_prompt: str = "You are now a practice exam generator. From now on, \
            you will generate practice exam's in LaTex code using data coming from a user. \
            The user will uploaded PDF's that may have Practice Exams, Question booklets, \
            Homework Assignments, Lecture Slides, Lecture Notes, and more coursework \
            related content. We will input all of this data to you as text from a pdf to \
            text generator, and you will give us a practice exam that follows a standard \
            LaTex format practice exam. Make sure that the difficulty and content match the \
            ones of the lectures and content given. You should also have a variety of questions \
            ranging from True/False, Multiple Choice,  and Free Response questions and potentially \
            assign point values to these as well. Only output the latex code."
        
        self.user_prompt: str = "Now, use these given inputs to generate a practice exam of at least \
                                 5 questions total given the proper specifications in the system prompt."
        openai_api_key = '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'
        self.client = OpenAI(
            api_key=openai_api_key,
        )

    
    def generate_exam(self, files: list[UploadFile]):
        pdf_text = ''
        for file in files:
            pdf_text += self.extract_text(file) + '\n'
        user_prompt = self.user_prompt + pdf_text
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt}]
            ).choices[0].message.content
        latex_start = response.find('\'\'\'') + len('\'\'\'')
        latex_end = response[latex_start:].find('\'\'\'')
        latex = response[latex_start: latex_end]
        pdf = build_pdf(latex)
        return response

        
        
    @staticmethod
    def extract_text(pdf_file: UploadFile) -> str:
        text = ""
        for page in pdf_file.pages:
            text += page.extract_text()
        return text
    

if __name__ == '__main__':
    e = ExamGenerator()
    pdf_path = Path('./practice_midterm_combined.pdf')
    pdf = PdfReader(pdf_path)
    print(e.generate_exam([pdf]))