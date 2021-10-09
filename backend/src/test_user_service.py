import random

import user_service
import bcrypt
import database_service
import unittest

db = database_service.connect_to_database("test")
users = db['users']
test_user = {
    'email': "email",
    'password': bcrypt.hashpw("pass123".encode('utf-8'), bcrypt.gensalt()),
    'emailNotifications': False,
    'smsNotifications': False,
    'notifications': {"room 1": 6},
    'favoriteRooms': ["room 2", "room 3"]
}


class TestUserService(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        users.insert_one(test_user)

    def testCreate(self):
        query = {'email': "email"}
        user = users.find_one(query)
        assert user

    def testUpdateSettings(self):
        query = {'email': "email"}
        user = users.find_one(query)
        notifications = user['notifications']
        initial_size = len(notifications)
        notifications['new room'] = random.randrange(30)
        users.find_one_and_update(query, {'$set': {'notifications': notifications}})
        user = users.find_one(query)
        new_notifications = user['notifications']
        assert len(new_notifications) == initial_size + 1

    def testRemove(self):
        query = {'email': "email"}
        users.delete_one(query)
        assert users.find_one(query) is None

    @classmethod
    def tearDownClass(cls):
        users.delete_many({})


if __name__ == '__main__':
    unittest.main()
