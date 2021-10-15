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
    if hasattr(e, "description"):
        return e.description, 400
    return repr(e), 400


@app.route('/')
def index():
    return "Hello world"


if __name__ == '__main__':
    app.run(debug=True)
