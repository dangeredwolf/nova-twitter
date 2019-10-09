const { TwitterAPI } = require("./TwitterAPI.js");
const { buildApiUrl } = require("./Helpers.js");

class MediaUpload {
    static initUpload(data) {
        return new Promise((resolve, reject) => {
            TwitterAPI.call(
                "https://upload.twitter.com/1.1/media/upload.json?command=INIT&total_bytes=" + data.blob.length +  "&media_type=" + data.mediaType,
                {account:data.account, method:"POST", postData:""}
            ).then((reply) => {
				let id = JSON.parse(reply).media_id;
				TwitterAPI.call(
	                "https://upload.twitter.com/1.1/media/upload.json?command=APPEND&segment_index=0&media_id=" + id,
	                {account:data.account, method:"POST", postData:data.blob}
	            ).then((reply) => {
					// from what I can tell, we just gotta hope it worked
					TwitterAPI.call(
		                "https://upload.twitter.com/1.1/media/upload.json?command=FINALIZE&media_id=" + id,
		                {account:data.account, method:"POST", postData:data.blob}
		            ).then((reply) => {
						try {
							resolve(JSON.parse(reply));
						} catch(e) {
							resolve(reply);
						}
		            }).catch(e => reject(e));
	            }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }
}

exports.MediaUpload = MediaUpload;
