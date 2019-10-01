const {electron, ipcRenderer} = require("electron");

class Settings {
    static openSettings() {
        ipcRenderer.send("open_settings");
    }
}

exports.Settings = Settings;
