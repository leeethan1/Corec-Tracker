import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

EMAIL = 'shi517@purdue.edu'
load_dotenv()
PASSWORD = os.getenv('EMAIL_PASSWORD')
AUTH = os.getenv("AUTH")


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
