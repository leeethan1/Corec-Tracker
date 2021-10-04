import pymongo
import ssl
from flask import Blueprint
import os
from dotenv import load_dotenv

database_service = Blueprint('app_database_service', __name__)

load_dotenv()
PASSWORD = os.getenv('DB_PASSWORD')


def connect_to_database(database):
    client = pymongo.MongoClient(
        "mongodb+srv://Admin:{}@captaincrunch.f29iw.mongodb.net/{}?retryWrites=true&w=majority".format(
            PASSWORD, database), ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
    return client[database]


if __name__ == '__main__':
    connect_to_database()
