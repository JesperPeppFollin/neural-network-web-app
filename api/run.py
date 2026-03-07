from flask import Flask, jsonify
from flask_cors import CORS
from .NN import run_model

app = Flask(__name__)
CORS(app)

@app.route("/api/run")
def run_script():
    
    accuracy, timeElapsed = run_model()

    return jsonify({
        "status": "finished",
        "accuracy": accuracy,
        "timeElapsed": timeElapsed
    })
