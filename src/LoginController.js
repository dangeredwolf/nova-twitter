const {ipcRenderer} = require("electron");

class LoginController {
    constructor(data) {
		window.loginOpen = true;
		//alert("You need to reauthenticate manually.");
		ipcRenderer.send("auth_twitter")
		throw "Authentication required";
    }

}

exports.LoginController = LoginController;
