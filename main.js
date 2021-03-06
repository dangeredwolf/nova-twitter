const {app, BrowserWindow, electron, ipcMain} = require("electron")
const path = require("path")

let mainWindow;
let settingsWindow;
let authWindow;

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

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true
		}
	})

	mainWindow.loadFile("index.html")

	mainWindow.webContents.openDevTools();
	mainWindow.webContents.userAgent = "Mozilla/5.0 ModernDeck/10.0 (Chrome, like AppleWebKit) Safari/537.36";

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

    ipcMain.on("open_settings", () => {
        createSettingsWindow()
   });

   ipcMain.on("auth_twitter", () => {
       authWindow = new BrowserWindow({
           width: 715,
           height: 540,
           webPreferences: {
               nodeIntegration: true
           }
       })
       authWindow.loadURL("https://mobile.twitter.com/login?hide_message=true&redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue");
	   authWindow.webContents.on("did-finish-load", (e) => {
		   console.log(e)
		   if (authWindow.webContents.getURL() === "https://twitter.com/" ||
		   authWindow.webContents.getURL() === "https://twitter.com/home" ||
		   authWindow.webContents.getURL() === "https://tweetdeck.twitter.com/" ||
		   authWindow.webContents.getURL() === "https://tweetdeck.twitter.com/?via_twitter_login=true") {
			   authWindow.loadURL("https://api.twitter.com")
		   }
		   authWindow.webContents.executeJavaScript("document.cookie").then(result => {
			   console.log(result.split("; "))
		   })
	   })
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
