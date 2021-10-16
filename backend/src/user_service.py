import datetime

from flask import Blueprint, request, session, json, jsonify
import bcrypt
import database_service
import exceptions
import notification_service as ns
import secrets

base_url = "http://127.0.0.1:5000"
days_until_expire = 2

user_service = Blueprint('app_user_service', __name__)
db = database_service.connect_to_database("database")
users = db["users"]

user_tokens = db["user tokens"]


@user_service.route('/signup/submit', methods=['POST', 'GET'])
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


@user_service.route('/login/submit', methods=['post', 'get'])
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

            if bcrypt.checkpw(password.encode('utf-8'), user_password):
                session["email"] = user_email
                return "Logged in successfully", 200
            else:
                raise exceptions.AuthError
        else:
            raise exceptions.AuthError
    raise exceptions.AuthError


@user_service.route('/logout', methods=['POST', "GET"])
def logout():
    if 'email' not in session:
        return json.dumps("already logged out")
    session.pop('email', None)
    return "Logged out successfully", 200


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


@user_service.route('/settings/password/update', methods=['POST', 'GET'])
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


@user_service.route('/settings/phone/update', methods=['POST', 'GET'])
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


@user_service.route('/settings/notifications/update', methods=['POST'])
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


@user_service.route('/forgot-password/submit', methods=['POST'])
def forgot_password():
    email = request.json['email']
    user = users.find_one({'email': email})
    if not user:
        raise exceptions.UserNotFound
    token = generate_token(email)
    link = "{}/password/reset/{}".format(base_url, token)
    body = "Here's the link to reset your password: {}".format(link)
    ns.send_email(email, "Reset your password", body)
    return token, 200


def generate_token(email):
    token = secrets.token_urlsafe()
    user_tokens.delete_many({'email': email})
    entry = {
        'token': token,
        'email': email,
        'time': datetime.datetime.utcnow()
    }
    user_tokens.insert_one(entry)
    return token


@user_service.route('/password/reset/submit', methods=['POST'])
def reset_password():
    token = request.args.get('token')
    entry = user_tokens.find_one({'token': token})
    if not entry:
        raise exceptions.UserNotFound
    elif entry['time'] < datetime.datetime.today() - datetime.timedelta(days=days_until_expire):
        raise exceptions.ExpiredToken
    email = entry['email']
    new_password = request.json['password']
    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    users.find_one_and_update({'email': email},
                              {'$set': {
                                  'password': hashed
                              }})
    return "Password updated", 200


@user_service.route('/favorites/get', methods=['POST'])
def get_favorites():
    if 'email' in session:
        email = session['email']
        user = users.find_one({'email', email})
        if user is None:
            raise exceptions.UserNotFound
        favorite_rooms = user['favoriteRooms']
        return favorite_rooms
    return exceptions.NotLoggedIn


@user_service.route('/favorites/add', methods=['POST'])
def add_to_favorites():
    user_email = request.json["email"]
    room = request.json["room"]
    if "email" not in session:
        # not logged in
        raise exceptions.NotLoggedIn
    else:
        query = {'email': user_email}
        entry = users.find_one(query)
        room_list = entry["favoriteRooms"]
        if room in room_list:
            # room already in favorites
            return "room already in favorites", 400
        else:
            room_list.append(room)
            new_entry = {"favoriteRooms": room_list}
            users.update_one(query, {'$set': new_entry})
            return jsonify("{} added to favorites".format(room))


@user_service.route('/favorites/remove', methods=['POST'])
def remove_favorite():
    user_email = request.json["email"]
    room = request.json["room"]

    if "email" not in session:
        # not logged in
        raise exceptions.NotLoggedIn
    else:
        # user is logged in
        query = {'email': user_email}
        user = users.find_one(query)
        if user is None:
            raise exceptions.UserNotFound
        room_list = user["favoriteRooms"]
        if room not in room_list:
            return "Room was not favorited to begin with!", 400
        else:
            room_list.remove(room)
            users.update_one(query, {'$set': {'favoriteRooms': room_list}})
            return jsonify("Removed {} from favorites".format(room))
