const {app, BrowserWindow, electron, ipcMain} = require("electron")
const path = require("path")

let mainWindow;
let settingsWindow;

let useFiddlerProxy = false;

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 715,
        height: 540,
        webPreferences: {
            nodeIntegration: true
        }
    })
    settingsWindow.loadFile("settings.html");
}

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true
		}
	})

	mainWindow.loadFile("index.html")

	mainWindow.webContents.openDevTools()

	mainWindow.on("closed", function () {
		mainWindow = null
	})

	mainWindow.webContents.on("new-window", (event, url) => {
		const { shell } = require("electron");
		event.preventDefault();
		console.log(url);

		if (url.indexOf("https://twitter.com/teams/authorize") >= 0) {
			console.log("this is a login teams window! new-window");
			event.newGuest = makeLoginWindow(url,true);
		} else if (url.indexOf("https://twitter.com/login") >= 0 || url.indexOf("https://twitter.com/logout") >= 0) {
			console.log("this is a login non-teams window! new-window");
			event.newGuest = makeLoginWindow(url,false);
		} else {
			shell.openExternal(url);
		}

		return event.newGuest;

	});

    ipcMain.on("open_settings",()=> {
        createSettingsWindow()
   });

   if (useFiddlerProxy) {
	   const ses = mainWindow.webContents.session;
	   ses.setProxy({proxyRules:"<local>:8888"});
	   console.log("Did the proxy thing, i hope");

   }
}

app.on("ready", createWindow)

app.on("window-all-closed", function () {
		app.quit()
})

app.on("activate", function () {
		if (mainWindow === null)
			createWindow()
})
