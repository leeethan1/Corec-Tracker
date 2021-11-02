import datetime
import os
import random
import re
import secrets
from functools import wraps

import bcrypt
import jwt
from dotenv import load_dotenv
from flask import Blueprint, request, session, json, jsonify

import database_service
import exceptions
import notification_service as ns

base_url = "https://127.0.0.1:3000"
days_until_expire = 2

user_service = Blueprint('app_user_service', __name__)
db = database_service.connect_to_database("database")
users = db["users"]

user_tokens = db["user tokens"]
email_verification_codes = db['email verification codes']
phone_verification_codes = db['phone verification codes']
unverified_accounts = db['unverified accounts']

email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
password_regex = re.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$")
phone_regex = "\w{3}-\w{3}-\w{4}"

load_dotenv()
my_secret = os.getenv("SECRET_KEY")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'access' in request.headers:
            token = request.headers['access']
        if not token:
            raise exceptions.NotLoggedIn
        try:
            data = jwt.decode(token, my_secret)
            user = users.find_one({"email": data['email']})
            if not user:
                raise exceptions.NotLoggedIn
        except Exception:
            print("decode error")
            raise exceptions.NotLoggedIn
        return f(user, *args, **kwargs)

    return decorated


@user_service.route('/settings/get', methods=['POST'])
@token_required
def get_user_settings(user):
    if 'startTime' in user and 'endTime' in user:
        return json.dumps(
            {
                "emailNotifications": user['emailNotifications'],
                "smsNotifications": user['smsNotifications'],
                "notifications": user['notifications'],
                "startTime": user['startTime'],
                "endTime": user['endTime']
            }
        ), 200
    else:
        return json.dumps(
            {
                "emailNotifications": user['emailNotifications'],
                "smsNotifications": user['smsNotifications'],
                "notifications": user['notifications'],
            }
        ), 200


@user_service.route('/signup/submit', methods=['POST', 'GET'])
def create_account():
    # if "email" in session:
    #     return "Already logged in", 402
    if request.method == 'POST':
        email = request.json["email"]
        password = request.json["password"]
        phone = request.json["phone"]

        # validate email, phone, and password
        if not re.fullmatch(email_regex, email):
            return json.dumps({"message": "Not a valid email"}), 400
        if not re.search(password_regex, password):
            return json.dumps(
                {"message": "Password should...\nhave at least one number.\nat least one uppercase and one lowercase " \
                            "character.\nat least one special symbol.\nhave between 6 to 20 characters long."}), 400
        # if not re.search(phone_regex, phone):
        #     return "Not a valid phone number", 400

        emailNotificationsOn = True
        smsNotificationsOn = True
        notifications = {}
        # Uncomment this section when database is established
        unverified_user = unverified_accounts.find_one({"email": email})
        user = users.find_one({"email": email})
        if user:
            # email already taken
            raise exceptions.DuplicateEmailError
        if unverified_user:
            unverified_accounts.delete_many({'email': email})

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_input = {'email': email,
                      'password': hashed,
                      'phone': phone}
        unverified_accounts.insert_one(user_input)

        # generate and send verification codes
        email_verification_codes.delete_many({'email': email})
        phone_verification_codes.delete_many({'phone': phone})
        email_code = generate_email_verification_code(email)
        phone_code = generate_phone_verification_code(phone)
        ns.send_email(email, "Verify your email", "Your email verification code is {}".format(email_code))
        ns.send_text(phone, "Your phone number verification code is {}".format(phone_code))

        return "Redirect to verification page to verify email and phone", 200
    return json.dumps({'message': "Could not create account"}), 400


@user_service.route('/account/verify/submit', methods=['POST'])
def verify_account():
    phone_verification_code = request.json['phoneCode']
    email_verification_code = request.json['emailCode']
    email_entry = email_verification_codes.find_one({'code': email_verification_code})
    phone_entry = phone_verification_codes.find_one({'code': phone_verification_code})
    if email_entry and phone_entry:
        email = email_entry['email']
        phone = phone_entry['phone']

        account = unverified_accounts.find_one({'$and': [{'email': email}, {'phone': phone}]})
        if not account:
            raise exceptions.UserNotFound

        emailNotificationsOn = True;
        smsNotificationsOn = True
        notifications = {}

        user_input = {'email': account['email'],
                      'password': account['password'],
                      'phone': account['phone'],
                      'emailNotifications': emailNotificationsOn,
                      'smsNotifications': smsNotificationsOn,
                      'notifications': notifications,
                      'favoriteRooms': []}
        users.insert_one(user_input)

        # remove user from unverified collection
        unverified_accounts.delete_many({'email': email})
        # remove verification codes for user
        email_verification_codes.delete_many({'email': email})
        phone_verification_codes.delete_many({'phone': phone})

        ns.send_email(email, "Welcome to Corec Tracker",
                      "Glad to have you on board! Enjoy all this app has to offer!")
        access_payload = {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }
        access_token = jwt.encode(
            payload=access_payload,
            key=my_secret
        )
        refresh_payload = {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        }
        refresh_token = jwt.encode(
            payload=refresh_payload,
            key=my_secret
        )
        # session["email"] = user_email
        return json.dumps(
            {'access_token': access_token, 'refresh_token': refresh_token}), 200
    else:
        return json.dumps(
            {'message': "Could not verify email or phone number.\nCheck that your verification codes are correct"}), 400


@user_service.route('/login/submit', methods=['post', 'get'])
def login():
    # if "email" in session:
    #     return "Already logged in", 402

    email = request.json["email"]
    password = request.json["password"]

    unverified = unverified_accounts.find_one({'email': email})
    if unverified:
        if bcrypt.checkpw(password.encode('utf-8'), unverified['password']):
            return {'message': "redirect to verify account page"}, 400
        else:
            raise exceptions.AuthError

    # Uncomment when db established
    user = users.find_one({"email": email})
    if user:
        user_email = user['email']
        user_password = user['password']
        if bcrypt.checkpw(password.encode('utf-8'), user_password):
            access_payload = {
                "email": user_email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
            }
            access_token = jwt.encode(
                payload=access_payload,
                key=my_secret
            )
            refresh_payload = {
                "email": user_email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
            }
            refresh_token = jwt.encode(
                payload=refresh_payload,
                key=my_secret
            )
            # session["email"] = user_email
            return json.dumps(
                {'access_token': access_token.decode("utf-8"), 'refresh_token': refresh_token.decode("utf-8")}), 200
        else:
            raise exceptions.AuthError
    else:
        raise exceptions.AuthError


@user_service.route('/googlelogin', methods=['post'])
def googleLogin():
    # if "email" in session:
    #     return json.dumps("already logged in")

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
            access_payload = {
                "email": email,
                "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=30)
            }
            access_token = jwt.encode(
                payload=access_payload,
                key=my_secret
            )
            refresh_payload = {
                "email": email,
                "exp": datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(hours=6)
            }
            refresh_token = jwt.encode(
                payload=refresh_payload,
                key=my_secret
            )
            # session["email"] = user_email
            return {'access_token': access_token, 'refresh_token': refresh_token}, 200

    raise exceptions.AuthError


@user_service.route('/logout', methods=['POST', "GET"])
def logout():
    # if 'email' in session:
    #     session.pop('email', None)
    return "Logged out successfully", 200


@user_service.route('/account/delete', methods=["POST"])
@token_required
def delete_account(user):
    email = user['email']
    users.delete_one({'email': email})


@user_service.route('/settings/email/update', methods=['PUT', 'GET'])
@token_required
def update_email(user):
    old_email = user['email']
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
@token_required
def update_password(user):
    # user = users.find_one({'email': session['email']})
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
@token_required
def update_phone(user):
    # user = users.find_one({'email': session['email']})
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
@token_required
def update_notifications(user):
    email = user['email']
    emailNotifications = request.json['emailNotifications']
    smsNotifications = request.json['smsNotifications']
    updated_notifications = request.json['notifications']
    users.find_one_and_update({'email': email},
                              {'$set': {'notifications': updated_notifications,
                                        'emailNotifications': emailNotifications,
                                        'smsNotifications': smsNotifications,
                                        'startTime': request.json['startTime'],
                                        'endTime': request.json['endTime']}})
    return "Notifications updated", 200


@user_service.route('/forgot-password/submit', methods=['POST'])
def forgot_password():
    email = request.json['email']
    if not re.fullmatch(email_regex, email):
        return json.dumps({'message': 'Not a valid email'}), 400
    user = users.find_one({'email': email})
    if not user:
        raise exceptions.UserNotFound
    token = generate_token(email)
    link = "{}/password/reset/{}".format(base_url, token)
    body = "Here's the link to reset your password: {}".format(link)
    ns.send_email(email, "Reset your password", body)
    return json.dumps({'token': token}), 200


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
    password_confirm = request.json['passwordConfirm']
    if new_password != password_confirm:
        return json.dumps({"message": "Passwords don't match"}), 400
    if not re.search(password_regex, new_password):
        return {"message": "Password should...\nhave at least one number.\nat least one uppercase and one lowercase "
                           "character.\nat least one special symbol.\nhave between 6 to 20 characters long."}, 400

    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    users.find_one_and_update({'email': email},
                              {'$set': {
                                  'password': hashed
                              }})
    user_tokens.find_one_and_delete({'token': token})
    # log user in
    # session['email'] = email
    return "Password updated", 200


@user_service.route('/favorites/get', methods=['POST'])
@token_required
def get_favorites(user):
    # email = user['email']
    # user = users.find_one({'email': email})
    if user is None:
        raise exceptions.UserNotFound
    favorite_rooms = user['favoriteRooms']
    return jsonify({'rooms': favorite_rooms})


@user_service.route('/favorites/add', methods=['POST'])
@token_required
def add_to_favorites(user):
    room = request.json['room']
    user_email = user['email']
    query = {'email': user_email}
    room_list = user["favoriteRooms"]
    if room in room_list:
        # room already in favorites
        return {'message': "room already in favorites"}, 400
    else:
        room_list.append(room)
        new_entry = {"favoriteRooms": room_list}
        users.update_one(query, {'$set': new_entry})
        return json.dumps({"rooms": room_list}), 200


@user_service.route('/favorites/remove', methods=['POST'])
@token_required
def remove_favorite(user):
    room = request.json['room']
    # user is logged in
    user_email = user['email']
    query = {'email': user_email}
    # user = users.find_one(query)
    if user is None:
        raise exceptions.UserNotFound
    room_list = user["favoriteRooms"]
    if room not in room_list:
        return "Room was not favorited to begin with!", 400
    else:
        room_list.remove(room)
        users.update_one(query, {'$set': {'favoriteRooms': room_list}})
        return json.dumps({"rooms": room_list}), 200


def generate_email_verification_code(email):
    code = str(random.randint(0, 999999))
    code = code.zfill(6)
    while email_verification_codes.find({'code': code}).count() > 0:
        code = str(random.randint(0, 999999))
        code = code.zfill(6)
    email_verification_codes.insert_one({
        'code': code,
        'email': email
    })
    return code


def generate_phone_verification_code(phone):
    code = str(random.randint(0, 999999))
    code = code.zfill(6)
    while phone_verification_codes.find({'code': code}).count() > 0:
        code = str(random.randint(0, 999999))
        code = code.zfill(6)
    phone_verification_codes.insert_one({
        'code': code,
        'phone': phone
    })
    return code
