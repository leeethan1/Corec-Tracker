import unittest
import database_service as ds
import record_service as rs

db = ds.connect_to_database("test")
records = db["records"]


class TestRecordService(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        rs.create_record('room 1', 87, records)

    def testCreate(self):
        record = records.find_one({'room': 'room 1'})
        assert record is not None

    def testGet(self):
        record_list = list(records.find({"hour": 17}))
        occupancies = [record['occupancy'] for record in record_list]
        if not occupancies:
            average = 0
        else:
            average = sum(occupancies) / len(occupancies)
        assert average == 87

    @classmethod
    def tearDownClass(cls) -> None:
        records.delete_many({})
