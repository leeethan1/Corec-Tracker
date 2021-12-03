import person_counter as pc
import unittest


class TestPersonCounter(unittest.TestCase):
    def testCount(self):
        assert pc.count_people_in_image('../images/test/2021-10-15_2.jpg') == 0
        #assert pc.count_people_in_image('../images/test/input_image3.png') == 3


if __name__ == '__main__':
    unittest.main()