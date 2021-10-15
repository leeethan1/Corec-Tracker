import datetime

import database_service as ds
import unittest
from notification_service import NOTIF_INTERVAL

db = ds.connect_to_database("test")
notifications = db['notifications']


class TestNotificationService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        notifications.delete_many({})

    def testNotExpired(self):
        notifications.insert_one({
            'email': 'test_email',
            'time': datetime.datetime.utcnow()
        })
        notification = notifications.find_one({'email': 'test_email'})
        assert notification is not None
        time = notification['time']
        difference = datetime.datetime.utcnow() - time
        minutes = difference.seconds / 60
        assert minutes < NOTIF_INTERVAL
