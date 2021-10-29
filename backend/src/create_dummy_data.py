import database_service
import random
import record_service
from datetime import datetime

db = database_service.connect_to_database("database")
records = db["records"]

def create():
    for i in range(0,51):
        occ = random.randint(10, 70)
        room = "room " + str(random.randint(1, 5))
        hour = random.randint(5, 24)
        day = random.randint(0, 7)
        new_record = {
            "room": room,
            "occupancy": occ,
            "hour": hour,
            "day": day,
            "time": datetime.utcnow()
        }
        records.insert_one(new_record)
        #record_service.create_record(room,occ,records)
    print("done")

def remove():
    records.delete_many({})
    print("done")

if __name__ == '__main__':
    create()
    #remove()