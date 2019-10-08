const https = require("https");
const axios = require("axios");

class TwitterAPI {
    static call(url, info) {
        var data="";
        var promiseMe = new Promise((resolve, reject) => {

            let theFunc = axios.request;
            // var postData;

            // console.log(url);

            let reqObj = {
                headers:
                {
                    Accept:"Accept: text/plain, */*",
                    Authorization:`Bearer ${info.account.bearerToken}`,
                    Cookie: `auth_token=${info.account.authToken}; ct0=00000000000000000000000000000000; lang=en`,
                    DNT:1,
                    "X-Csrf-Token":"00000000000000000000000000000000",
                    Referer:"https://tweetdeck.twitter.com/",
                    "User-Agent":"Mozilla/5.0 ModernDeck/10.0 (Chrome, like AppleWebKit) Safari/537.36"
                },
                method: (info.method || "GET"),
                path:"/" + url.match(/(?<=:\/\/[\w\.]+\/).+/g)[0],
                hostname:url.match(/(?<=:\/\/)[\w\.]+(?=\/)/g)[0],
				data: info.postData
            }

            // console.log(reqObj);

            if (info.method === "POST") {
                // reqObj.headers["Content-Type"] = "application/x-www-form-urlencoded";
                // reqObj.headers["Content-Length"] = Buffer.byteLength(postData);

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

            // console.log(info.postData);

        });

        return promiseMe;
    }
}

exports.TwitterAPI = TwitterAPI;
