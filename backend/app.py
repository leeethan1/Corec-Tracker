from flask import Flask
from backend.src.UserService import user_service

app = Flask(__name__)
app.register_blueprint(user_service)

if __name__ == '__main__':
    app.run(debug=True)