from flask import Flask, jsonify
from pdf_merge_app import app as react_app

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    # Example data
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)