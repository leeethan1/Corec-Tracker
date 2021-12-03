import person_counter as pc
import unittest


class TestPersonCounter(unittest.TestCase):
    def testCount(self):
        x = "String" + 3
        assert pc.count_people_in_image('../images/test/2021-10-15.jpg') == 1
        #assert pc.count_people_in_image('../images/test/input_image3.png') == 3


if __name__ == '__main__':
    unittest.main()