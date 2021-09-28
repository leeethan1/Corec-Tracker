from __main__ import app
from flask import Flask, request, session, json
import bcrypt

@app.route('/signup', methods=['post', 'get'])
def create_account():
    if "email" in session:
        return json.dumps(False)
    if request.method == 'POST':
        email = request.form.get("email")
        password = request.form.get("password")

        #Uncomment this section when database is established
        # user = records.find_one({"email": email})
        # if user:
        #     #email already taken
        #     return json.dumps(False)
        #
        # hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # user_input = {'email': email, 'password': hashed}
        # records.insert_one(user_input)
        return json.dumps(True)
    return json.dumps(False)


@app.route('/login', methods=['post', 'get'])
def login():
    if "email" in session:
        return json.dumps(True)

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        #Uncomment when db established
        # user = records.find_one({"email": email})
        # if user:
        #     user_email = user['email']
        #     user_password = user['password']
        #
        #     if bcrypt.checkpw(password.encode('utf-8'), user_password):
        #         session["email"] = user_email
        #         return json.dumps(True)
        #     else:
        #         return json.dumps(False)
        # else:
        #     return json.dumps(False)
    return json.dumps(False)