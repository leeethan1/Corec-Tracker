import pymongo
import base64
import ssl

# PASSWORD = "aWxvdmVmcmllczE="
PASSWORD = "Cs307lol"


def connect_to_database(database):
    client = pymongo.MongoClient(
        "mongodb+srv://Admin:{}@captaincrunch.f29iw.mongodb.net/{}?retryWrites=true&w=majority".format(
            PASSWORD, database), ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
    return client[database]
