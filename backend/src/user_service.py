from flask import Blueprint, request, session, json
import bcrypt
import database_service
import exceptions

user_service = Blueprint('app_user_service', __name__)
db = database_service.connect_to_database("database")
users = db["users"]


@user_service.route('/signup', methods=['POST'])
def create_account():

    if "email" in session:
        return json.dumps("redirect")
    if request.method == 'POST':
        email = request.json["email"]
        password = request.json["password"]
        phone = request.json["phone"]
        emailNotificationsOn = True
        smsNotificationsOn = True
        notifications = {}
        # Uncomment this section when database is established
        user = users.find_one({"email": email})
        if user:
            # email already taken
            raise exceptions.DuplicateEmailError

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
        return "Signed up successfully", 200
    return json.dumps("could not create account")


@user_service.route('/login', methods=['post'])
def login():
    if "email" in session:
        return json.dumps("already logged in")

    if request.method == "POST":
        email = request.json["email"]
        password = request.json["password"]

        # Uncomment when db established
        user = users.find_one({"email": email})
        if user:
            user_email = user['email']
            user_password = user['password']
            # user_name = user['name']

            if bcrypt.checkpw(password.encode('utf-8'), user_password):
                session["email"] = user_email
                return {'user': email}, 200
            else:
                raise exceptions.AuthError
        else:
            raise exceptions.AuthError
    raise exceptions.AuthError

@user_service.route('/googlelogin', methods=['post'])
def googleLogin():
    if "email" in session:
        return json.dumps("already logged in")

    if request.method == "POST":
        email = request.json["email"]

        # Uncomment when db established
        user = users.find_one({"email": email})
        if not user:
            emailNotificationsOn = True
            smsNotificationsOn = True
            notifications = {}
            user_input = {'email': email,
                'emailNotifications': emailNotificationsOn,
                'smsNotifications': smsNotificationsOn,
                'notifications': notifications,
                'favoriteRooms': []}
            users.insert_one(user_input)
        return {'message': "Google log in success"}

    raise exceptions.AuthError


@user_service.route('/logout', methods=['POST', "GET"])
def logout():
    if 'email' not in session:
        return json.dumps("already logged out")
    session.pop('email', None)
    return {'message': "Logged out successfully"}, 200


@user_service.route('/settings/email/update', methods=['PUT', 'GET'])
def update_email():
    if 'email' not in session:
        raise exceptions.NotLoggedIn
    old_email = session['email']
    new_email = request.json['email']
    if new_email == old_email:
        raise exceptions.DuplicateEmailError
    else:
        existing_user = users.find_one({'email': new_email})
        if not existing_user:
            users.find_one_and_update({'email': old_email},
                                      {'$set': {
                                          'email': new_email
                                      }})
            return "Email updated", 200
        else:
            raise exceptions.DuplicateEmailError


@user_service.route('/settings/password/update', methods=['PUT', 'GET'])
def update_password():
    if 'email' not in session:
        raise exceptions.NotLoggedIn
    user = users.find_one({'email': session['email']})
    old_password = user['password']
    new_password = request.json['password']
    if bcrypt.checkpw(new_password.encode('utf-8'), old_password):
        raise exceptions.SamePasswordError
    else:
        hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        users.find_one_and_update({'email': session['email']},
                                  {'$set': {
                                      'password': hashed
                                  }})
        return "Password updated", 200


@user_service.route('/settings/phone/update', methods=['PUT', 'GET'])
def update_phone():
    if 'email' not in session:
        raise exceptions.NotLoggedIn
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
        return "Phone updated", 200


@user_service.route('/settings/notifications/update', methods=['PUT'])
def update_notifications():
    if 'email' not in session:
        raise exceptions.NotLoggedIn
    email = session['email']
    emailNotifications = request.json['emailNotifications']
    smsNotifications = request.json['smsNotifications']
    updated_notifications = request.json['notifications']
    users.find_one_and_update({'email': email},
                              {'$set': {'notifications': updated_notifications,
                                        'emailNotifications': emailNotifications,
                                        'smsNotifications': smsNotifications}})
    return "Notifications updated", 200
