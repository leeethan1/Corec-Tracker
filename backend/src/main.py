import json

from flask import Flask, jsonify
from record_service import record_service
from user_service import user_service
from camera_service import camera_service
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.register_blueprint(record_service)
app.register_blueprint(user_service)
app.register_blueprint(camera_service)

load_dotenv()
app.secret_key = os.getenv('SECRET_KEY')


# error handling
@app.errorhandler(Exception)
def handle_exception(e):
    code = 400
    message = repr(e)
    if hasattr(e, "code"):
        code = e.code
    if hasattr(e, "message"):
        message = e.message
    return json.dumps({'message': message}), code


@app.route('/')
def index():
    return "Hello world"


if __name__ == '__main__':
    app.run(debug=True)
