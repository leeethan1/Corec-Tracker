import datetime
import unittest
import database_service as ds
import record_service as rs

db = ds.connect_to_database("test")
records = db["records"]


class TestRecordService(unittest.TestCase):
    def testCreate(self):
        rs.create_record('room 1', 87, records)
        record = records.find_one({'room': 'room 1'})
        assert record is not None
        records.delete_many({})

    def testGet(self):
        for i in range(1, 11):
            rs.create_record('room 1', i, records)
        record_list = list(records.find({"hour": datetime.datetime.utcnow().hour}))
        occupancies = [record['occupancy'] for record in record_list]
        if not occupancies:
            average = 0
        else:
            average = sum(occupancies) / len(occupancies)
        assert average == 5.5

    def testExpired(self):
        rs.create_record('room 1', 87, records)
        records.update_one({'room': 'room 1'},
                           {'$set': {'time': datetime.datetime.utcnow() - datetime.timedelta(days=8)}})
        expired_records = records.find({'time': {'$lt': datetime.datetime.utcnow() - datetime.timedelta(days=7)}})
        assert expired_records.count() > 0

    @classmethod
    def tearDownClass(cls) -> None:
        records.delete_many({})
