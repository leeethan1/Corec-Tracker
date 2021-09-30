import user_service
import database_service
import unittest

db = database_service.connect_to_database("test")
users = db['users']
test_user = {
    'email': "email",
    'password': "pass123",
    'emailNotifications': False,
    'smsNotifications': False,
    'notifications': {"room 1": 6},
    'favoriteRooms': ["room 2", "room 3"]
}


class TestUserService(unittest.TestCase):
    def testCreate(self):
        users.insert_one(test_user)
        query = {'email': "email"}
        user = users.find_one(query)
        assert user

    def testRemove(self):
        query = {'email': "email"}
        users.delete_one(query)
        assert users.find_one(query) is None


if __name__ == '__main__':
    unittest.main()
