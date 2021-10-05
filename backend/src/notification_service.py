import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
from twilio.rest import Client
import json

EMAIL = 'shi517@purdue.edu'
load_dotenv()
PASSWORD = os.getenv('EMAIL_PASSWORD')

SID = os.getenv('ACCOUNT_SID')
AUTH = os.getenv("AUTH")
PHONE = os.getenv('PHONE')

client = Client(SID, AUTH)


def send_email(email, body):
    smtp_server = "smtp-mail.outlook.com"
    port = 587
    server = smtplib.SMTP(smtp_server, port)
    context = ssl.create_default_context()

    # Try to log in to server and send email
    try:
        server.ehlo()  # Can be omitted
        server.starttls(context=context)  # Secure the connection
        server.ehlo()  # Can be omitted
        server.login(EMAIL, PASSWORD)

        # create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL
        msg['To'] = email
        msg['Subject'] = "Let's work out!"
        msg.attach(MIMEText(body, 'plain'))

        server.send_message(msg)
        print("email sent")
    except Exception as e:
        # Print any error messages to stdout
        print(e)
    finally:
        server.quit()


def send_email_alert(email, occupancy, room):
    body = "{} is at {} people, time to get those gains up!".format(room, occupancy)
    send_email(email, body)


def send_text(to_phone, occupancy, room):
    try:
        message = client.messages.create(
            body="{} is at {} people, time to get those gains up!".format(room, occupancy),
            from_=PHONE,
            to=to_phone
        )
        print("sms sent")
    except Exception as e:
        print(e)
