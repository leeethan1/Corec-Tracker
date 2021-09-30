import pymongo
import base64
import ssl

PASSWORD = "aWxvdmVmcmllczE="


def connect_to_database(database):
    client = pymongo.MongoClient(
        "mongodb+srv://dshi:{}@cs307-project.yw0gw.mongodb.net/{}?retryWrites=true&w=majority".format(
            base64.b64decode(PASSWORD).decode("utf-8"), database), ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
    return client[database]
