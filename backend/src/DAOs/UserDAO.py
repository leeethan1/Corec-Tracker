import pymongo

myclient = pymongo.MongoClient()
mydb = myclient["database"]
mycol = mydb["users"]

class UserDao:

    def getUserByEmail(email):
        query = {"email": email}
        return mycol.find(query)

