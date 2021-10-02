from flask import Blueprint, request, session, json
import bcrypt
import database_service

user_service = Blueprint('app_user_service', __name__)
db = database_service.connect_to_database("database")
users = db["users"]


@user_service.route('/signup', methods=['POST', 'GET'])
def create_account():
    if "email" in session:
        return json.dumps("redirect")
    if request.method == 'POST':
        email = request.json["email"]
        password = request.json["password"]
        phone = request.json["phone"]
        emailNotificationsOn = True;
        smsNotificationsOn = True
        notifications = {}

        # Uncomment this section when database is established
        user = users.find_one({"email": email})
        if user:
            # email already taken
            return json.dumps("this email is already in use")

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_input = {'email': email,
                      'password': hashed,
                      'phone': phone,
                      'emailNotifications': emailNotificationsOn,
                      'smsNotifications': smsNotificationsOn,
                      'notifications': notifications,
                      'favoriteRooms': []}
        users.insert_one(user_input)
        session['email'] = email
        return json.dumps("successfully signed up")
    return json.dumps("could not create account")


@user_service.route('/login', methods=['post', 'get'])
def login():
    if "email" in session:
        return json.dumps("redirect")

    if request.method == "POST":
        email = request.json["email"]
        password = request.json["password"]

        # Uncomment when db established
        user = users.find_one({"email": email})
        if user:
            user_email = user['email']
            user_password = user['password']

            if bcrypt.checkpw(password.encode('utf-8'), user_password):
                session["email"] = user_email
                return json.dumps("successfully logged in")
            else:
                return json.dumps("incorrect email or password")
        else:
            return json.dumps("incorrect email or password")
    return json.dumps("could not log in")


@user_service.route('/logout', methods=['POST', "GET"])
def logout():
    if 'email' not in session:
        return json.dumps("already logged out")
    session.pop('email', None)
    return json.dumps("successfully logged out")


@user_service.route('/settings/email/update', methods=['PUT', 'GET'])
def update_email():
    if 'email' not in session:
        return json.dumps('not logged in')
    old_email = session['email']
    new_email = request.json['email']
    if new_email == old_email:
        return json.dumps("new email can't be same as old")
    else:
        existing_user = users.find_one({'email': new_email})
        if not existing_user:
            users.find_one_and_update({'email': old_email},
                                      {'$set': {
                                          'email': new_email
                                      }})
            return json.dumps('Email updated')
        else:
            return json.dumps("That email is already taken")


@user_service.route('/settings/password/update', methods=['PUT', 'GET'])
def update_password():
    if 'email' not in session:
        return json.dumps('not logged in')
    user = users.find_one({'email': session['email']})
    old_password = user['password']
    new_password = request.json['password']
    if bcrypt.checkpw(new_password.encode('utf-8'), old_password):
        return json.dumps("new password can't be same as old password")
    else:
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        users.find_one_and_update({'email': session['email']},
                                  {'$set': {
                                      'password': hashed
                                  }})
        return json.dumps('Password updated')


@user_service.route('/settings/phone/update', methods=['PUT', 'GET'])
def update_phone():
    if 'email' not in session:
        return json.dumps('not logged in')
    user = users.find_one({'email': session['email']})
    old_phone = user['phone']
    new_phone = request.json['phone']
    if old_phone == new_phone:
        return json.dumps("new phone number can't be same as old phone number")
    else:
        users.find_one_and_update({'email': session['email']},
                                  {'$set': {
                                      'phone': new_phone
                                  }})
        return json.dumps('Phone number updated')


@user_service.route('/settings/notifications/update', methods=['PUT'])
def update_notifications():
    if 'email' not in session:
        return json.dumps('not logged in')
    email = session['email']
    emailNotifications = request.json['emailNotifications']
    smsNotifications = request.json['smsNotifications']
    updated_notifications = request.json['notifications']
    users.find_one_and_update({'email': email},
                              {'$set': {'notifications': updated_notifications,
                                        'emailNotifications': emailNotifications,
                                        'smsNotifications': smsNotifications}})
    return json.dumps('settings updated')
