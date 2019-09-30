const https = require("https");

class TwitterAPI {
    static call(url, info) {
        var data="";
        var promiseMe = new Promise((resolve, reject) => {

            let theFunc = https.get;
            if (info.method === "POST") {
                theFunc = https.request
            }

            theFunc(url,
                {
                    headers:
                    {Authorization:`Bearer ${info.bearer || bearerTest}`,
                    "Cookie": `auth_token=${info.auth_token}; ct0=00000000000000000000000000000000; lang=en`,
                    "X-Csrf-Token":"00000000000000000000000000000000"},
                    method: (info.method || "GET")
                },
                (res) => {
                    console.log(res);
                    res.on("data", (d) => {
                        data += d;
                    });
                    res.on("end", () => {
                        resolve(data);
                    });
                }
            );
        });

        return promiseMe;
    }
}

exports.TwitterAPI = TwitterAPI;
