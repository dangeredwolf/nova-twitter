const https = require("https");
const axios = require("axios");
const StorageAccount = require("./StorageAccount.js");
const qs = require('qs');

window.useFiddlerProxy = false;

class TwitterAPI {

    static call(url, info) {
        var data="";
        var promiseMe = new Promise((resolve, reject) => {

            let theFunc = axios.request;
			let realAccount;
            // var postData;

            // console.log(url);
			console.log(typeof info.postData)

			if (!info.account) {
				throw "Account property required";
			}

			if (!info.account.bearerToken) {
				console.log("Using x-act-as-user-id");
				realAccount = info.account;
				info.account = StorageAccount.getDefaultAccount();
			}

            let reqObj = {
                headers:
                {
                    Accept:"Accept: text/plain, */*",
                    Authorization:`Bearer ${info.account.bearerToken}`,
                    Cookie: `auth_token=${info.account.authToken}; ct0=00000000000000000000000000000000; lang=en`,
                    DNT:1,
                    "X-Csrf-Token":"00000000000000000000000000000000",
					"X-Twitter-Auth_type":"OAuth2Session",
                    Origin:"https://tweetdeck.twitter.com/",
                    Referer:"https://tweetdeck.twitter.com/",
                    "User-Agent":"Mozilla/5.0 ModernDeck/10.0 (Chrome, like AppleWebKit) Safari/537.36"
                },

                method: (info.method || "GET"),
                path:"/" + url.match(/(?<=:\/\/[\w\.]+\/).+/g)[0],
                hostname:url.match(/(?<=:\/\/)[\w\.]+(?=\/)/g)[0],
				data: info.postData
            }

			if (info.addHeaders) {
				for (let i in info.addHeaders) {
					reqObj.headers[i] = info.addHeaders[i];
				}
			}

			if (window.useFiddlerProxy) {
				reqObj.proxy = {
					host:"127.0.0.1",
					port:8888
				}
			}

			if (!!realAccount) {
				reqObj.headers["x-act-as-user-id"] = realAccount.twitterId;
			}

            // console.log(reqObj);

            if (info.method === "POST") {
                reqObj.headers["Content-Type"] = "application/x-www-form-urlencoded";
                reqObj.headers["Content-Length"] =(info.postData.length);

            }

            var req = theFunc(url,
                reqObj
            ).then((data) => {
				// console.log(data)
				if (typeof data === "object") {
					resolve(data);
				}
			}).catch(e => {
                console.error(`Request error: ${e.message}\nOccurred during a request for ` + url);
				if (e.response) {
					console.log(e.response.data);
					console.log(e.response.status);
					console.log(e.response.headers);
				}
            });

            console.log(info.postData);

        });

        return promiseMe;
    }
}

exports.TwitterAPI = TwitterAPI;
