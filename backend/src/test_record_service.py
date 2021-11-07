import datetime
import random
import unittest
import database_service as ds
import record_service as rs

db = ds.connect_to_database("test")
records = db["records"]


def create_dummy_data():
    for i in range(1, 51):
        rs.create_record('Room 1', i, records)


class TestRecordService(unittest.TestCase):
    def testCreate(self):
        rs.create_record('room 1', 87, records)
        record = records.find_one({'room': 'room 1'})
        assert record is not None
        records.delete_many({})

    # def testGet(self):
    #     for i in range(1, 11):
    #         rs.create_record('room 1', i, records)
    #     record_list = list(records.find({"hour": datetime.datetime.utcnow().hour}))
    #     occupancies = [record['occupancy'] for record in record_list]
    #     if not occupancies:
    #         average = 0
    #     else:
    #         average = sum(occupancies) / len(occupancies)
    #     assert average == 5.5

    def testExpired(self):
        rs.create_record('room 1', 87, records)
        records.update_one({'room': 'room 1'},
                           {'$set': {'time': datetime.datetime.utcnow() - datetime.timedelta(days=8)}})
        expired_records = records.find({'time': {'$lt': datetime.datetime.utcnow() - datetime.timedelta(days=7)}})
        assert expired_records.count() > 0

    def testGetAdvancedData(self):
        create_dummy_data()
        data = list(records.find({'room': 'Room 1'}))
        occupancies = [record['occupancy'] for record in data]
        assert min(occupancies) == 1
        assert max(occupancies) == 50
        assert sum(occupancies) == (51 * 50) / 2

    @classmethod
    def tearDownClass(cls) -> None:
        records.delete_many({})
