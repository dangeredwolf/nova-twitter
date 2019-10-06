const https = require("https");

class TwitterAPI {
    static call(url, info) {
        var data="";
        var promiseMe = new Promise((resolve, reject) => {

            let theFunc = https.get;
            var postData;
            if (info.method !== "GET" && typeof info.method !== "undefined") {
                theFunc = https.request;
            }

            console.log(url);

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
                hostname:url.match(/(?<=:\/\/)[\w\.]+(?=\/)/g)[0]
            }

            console.log(reqObj);

            if (info.method === "POST") {
                postData = JSON.stringify(info.postData)
                reqObj.headers["Content-Type"] = "application/x-www-form-urlencoded";
                reqObj.headers["Content-Length"] = Buffer.byteLength(postData);

            }

            var req = theFunc(url,
                reqObj,
                (res) => {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                    res.setEncoding("utf8");
                    res.on("data", (d) => {
                        data += d;
                    });
                    res.on("end", () => {
                        if (JSON.parse(data)) {
                            if (typeof JSON.parse(data).errors !== "undefined") {
                                reject(data)
                            }
                        }
                        resolve(data);
                    });
                }
            );

            if (info.method === "POST") {
                req.write(postData);
                req.end();
            }
            req.on("error", (e) => {
                console.error(`Request failure: ${e.message}`);
            });

            console.log(postData);

        });

        return promiseMe;
    }
}

exports.TwitterAPI = TwitterAPI;
