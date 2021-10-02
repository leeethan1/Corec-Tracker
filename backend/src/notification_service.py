import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from twilio.rest import Client
import json

EMAIL = 'shi517@purdue.edu'
# PASSWORD = 'bkytzllfbxcjrdkr'
PASSWORD = 'Ilovefries1!'

account_SID = "AC8ad04c432e9b9c73540e3b43a74d6380"
auth_token = "7cf07108bcf6aff9698888b3bca98c64"
client = Client(account_SID, auth_token)
from_number = '+12525926607'


def send_text(phone, occupancy, room):
    # format phone
    phone = '+1' + phone.replace('-', '')

    body = "{} is at {} people, time to get those gains up!".format(room, occupancy)

    try:
        client.messages.create(
            to=phone,
            from_=from_number,
            body=body
        )
        print("SMS sent")
    except Exception as e:
        print(e)


def send_email(email, occupancy, room):
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
        body = "{} is at {} people, time to get those gains up!".format(room, occupancy)
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
