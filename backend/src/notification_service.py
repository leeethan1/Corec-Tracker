import smtplib, ssl

EMAIL = 'danielshi0516@gmail.com'
PASSWORD = 'bkytzllfbxcjrdkr'

smtp_server = "smtp.gmail.com"
port = 456
server = smtplib.SMTP(smtp_server, port)


def send_email():
    context = ssl.create_default_context()

    # Try to log in to server and send email
    try:
        server.ehlo()  # Can be omitted
        server.starttls(context=context)  # Secure the connection
        server.ehlo()  # Can be omitted
        server.login(EMAIL, PASSWORD)
        # TODO: Send email here
        server.sendmail(EMAIL, "shi517@purdue.edu", "this is a test email")
    except Exception as e:
        # Print any error messages to stdout
        print(e)
    finally:
        server.quit()
