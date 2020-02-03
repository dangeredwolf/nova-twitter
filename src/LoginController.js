
class LoginController {
    constructor(data) {
		window.loginOpen = true;
		alert("You need to reauthenticate manually.");
		throw "Authentication required";
    }

}

exports.LoginController = LoginController;
