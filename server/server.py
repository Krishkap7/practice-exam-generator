from flask import Flask, request, jsonify
from flask_cors import CORS
from helpers import ExamGenerator  # Importing ExamGenerator from helpers.py

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('files')

    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'No selected files'}), 400

    exam_generator = ExamGenerator()
    final_pdf = None

    for file in files:
        if file and allowed_file(file.filename):
            # Process each file stream directly
            final_pdf = exam_generator.generate_exam(file.stream)  # Passing the file stream
        else:
            return jsonify({'error': f'Invalid file type: {file.filename}'}), 400

    # The final_pdf variable should now contain the final PDF content
    # Depending on how your generate_exam method works, return the appropriate response

    return jsonify({'result': final_pdf}), 200

if __name__ == '__main__':
    app.run(debug=True)
