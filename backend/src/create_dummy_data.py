import database_service
import random
import record_service
from datetime import datetime, timedelta
import bcrypt

db = database_service.connect_to_database("database")
records = db["records"]
admins = db['admins']


def create():
    for i in range(0, 101):
        occ = random.randint(10, 70)
        room = "Room " + str(random.randint(1, 5))
        hour = random.randint(5, 24)
        day = random.randint(0, 7)
        new_record = {
            "room": room,
            "occupancy": occ,
            "hour": hour,
            "day": day,
            "time": datetime.utcnow() - timedelta(weeks=random.randint(0, 4))
        }
        records.insert_one(new_record)
        # record_service.create_record(room,occ,records)
    print("done")


def remove():
    records.delete_many({})
    print("done")


if __name__ == '__main__':
    # remove()
    # create()
    password = 'pass123'
    admins.insert_one({
        'username': 'admin123',
        'password': bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    })
