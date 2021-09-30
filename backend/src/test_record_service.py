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

    def testGet(self):
        records_as_json = rs.get_average_occupancy(17)
        #incomplete
        assert True
