from flask import Blueprint, request, session, json, jsonify
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


@user_service.route('/settings/update', methods=['PUT'])
def update_notifications():
    if 'email' not in session:
        return json.dumps('not logged in')
    email = request.json['email']
    emailNotifications = request.json['emailNotifications']
    smsNotifications = request.json['smsNotifications']
    updated_notifications = request.json['notifications']
    users.find_one_and_update({'email': email},
                              {'$set': {'notifications': updated_notifications,
                                        'emailNotifications': emailNotifications,
                                        'smsNotifications': smsNotifications}})
    return json.dumps('settings updated')


# favorite_rooms = db["favorite rooms"]


@user_service.route('/add-to-favorites', methods=['POST'])
def add_to_favorites():
    user_email = request.json["email"]
    room = request.json["room"]
    if "email" not in session:
        # not logged in
        return jsonify("user not logged in")
    else:
        query = {'email':user_email}
        entry = users.find_one(query)
        room_list = entry["favoriteRooms"]
        if room in room_list:
            # room already in favorites
            return jsonify("room already in favorites")
        else:
            room_list.append(room)
            new_entry = {"favoriteRooms": room_list}
            users.update_one(query, {'$set': new_entry})
            return jsonify("successful")


# how to route to a specific user?
# user should already be logged in to access this page. Otherwise defavoriting rooms does not make sense
@user_service.route('/remove-favorite', methods=['POST'])
def remove_favorite():
    user_email = request.json["email"]
    # what does request["room"] do?
    room = request.json["room"]

    if "email" not in session:
        # not logged in
        return jsonify("must be logged in to access!")
    else:
        # user is logged in
        query = {'email': user_email}
        entry = users.find_one(query)
        room_list = entry["favoriteRooms"]
        if room not in room_list:
            return jsonify("Room was not favorited to begin with!")
        else:
            room_list.remove(room)
            new_entry = {"favoriteRooms": room_list}
            users.update_one(query, {'$set': new_entry})
            return jsonify("Removal successful")

