import pymongo

myclient = pymongo.MongoClient()

mydb = myclient["database"]

mycol = mydb["users"]

