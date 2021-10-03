class AuthError(Exception):
    code = 403
    description = 'Email or password is incorrect'


class DuplicateEmailError(Exception):
    code = 403
    description = "That email is already taken"


class SamePasswordError(Exception):
    code = 403
    description = "New password cannot be the same as old password"


class NotLoggedIn(Exception):
    code = 403
    description = "You are not logged in"