from flask import Flask, jsonify
from neural_net import run_model
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route("/api/run")
def run_script():
    # simulate long running python script
    time.sleep(2)

    return jsonify({
        "message": "Python API working"
    })


# for testing only
if __name__ == "__main__":
    app.run(port=5000)