const { TwitterAPI } = require("./TwitterAPI.js");
const { buildApiUrl } = require("./Helpers.js");

class MediaUpload {
    static initUpload(data) {
        return new Promise((resolve, reject) => {
            TwitterAPI.call(
                "https://upload.twitter.com/1.1/media/upload.json?command=INIT&total_bytes=" +  Buffer.byteLength(data.blob) +  "&media_type=" + data.mediaType,
                {account:data.account, method:"POST", postData:""}
            ).then((reply) => {
				let id = reply.data.media_id;
// 				let postData = `--WebKitFormBoundaryqxYgsYW2XXWiNLsh
// Content-Disposition: form-data; name="media"; filename="blob"
// Content-Type: application/octet-stream
//
// ${data.blob}
// --WebKitFormBoundaryqxYgsYW2XXWiNLsh--`

let postData = `------WebKitFormBoundaryqxYgsYW2XXWiNLsh
Content-Disposition: form-data; name="media"; filename="blob"
Content-Type: application/octet-stream

${data.blob}
------WebKitFormBoundaryqxYgsYW2XXWiNLsh--`
				// let postData = new FormData();
				// postData.append("media", data.blob)
				console.log(typeof data.blob);
				console.log(postData.length)
				// postData.set("media", data.blob)
				console.log(postData);
				TwitterAPI.call( //
	                "https://upload.twitter.com/1.1/media/upload.json?command=APPEND&media_id=" + id + "&segment_index=0",
	                {account:data.account, addHeaders:{"Content-Length":postData.length,"Content-Type":"multipart/form-data; boundary=WebKitFormBoundaryqxYgsYW2XXWiNLsh"}, method:"POST", postData:postData}
	            ).then((reply) => {
					// from what I can tell, we just gotta hope it worked

					TwitterAPI.call(
		                "https://upload.twitter.com/1.1/media/upload.json?command=FINALIZE&media_id=" + id,

		                {account:data.account, method:"POST", postData:""}
					).then((finalReply) => {
						resolve(finalReply.data);
		            }).catch(e => reject(e));
	            }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }
}







exports.MediaUpload = MediaUpload;
