from flask import Flask
from record_service import record_service
from user_service import user_service

app = Flask(__name__)
app.register_blueprint(record_service)
app.register_blueprint(user_service)
app.secret_key = 'SECRET_KEY'


@app.route('/')
def index():
    return "Hello world"


if __name__ == '__main__':
    app.run(debug=True)
