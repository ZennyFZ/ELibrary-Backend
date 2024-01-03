class userController {

    Login(req, res, next) {
        res.send('Login');
    }

    Register(req, res, next) {
        res.send('Register');
    }

    Logout(req, res, next) {
        res.send('Logout');
    }

    UpdateProfile(req, res, next) {
        res.send('Update Profile');
    }

    ChangePassword(req, res, next) {
        res.send('Change Password');
    }

    getCurrentUser(req, res, next) {
        res.send('Get User Info');
    }
}

module.exports = new userController();