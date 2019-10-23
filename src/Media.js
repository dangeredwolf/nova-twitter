
const { ModalMedia } = require("./ModalMedia.js");

class Media {

	element;
	obj;

	/*
		String url (required)
		Object obj:
			String obj.type: "photo"|"video", undefined = "photo"
			obj.display_url: String|undefined
	*/
	constructor(url, obj) {
		obj = obj || {};
		obj.type = obj.type || "photo";
		obj.display_url = obj.display_url || url;
		obj.num = obj.num || 0;

		this.obj = obj;

		switch(obj.type) {
			case "photo":
				this.element = make("a").addClass("tweet-media waves-effect waves-dark").attr("href",obj.display_url).attr("target","_blank").append(
					make("div").addClass("tweet-media-img").attr("style","background-image:url(\""+url+"\")")
				).click(e => {
					e.preventDefault();
					e.stopPropagation();
					if (obj.tweet) {
						new ModalMedia({tweet:obj.tweet,num:obj.num});
					}
				}).on("mousedown", e => {
					e.stopPropagation();
				});
				break;
			case "video":
				this.element = make("iframe").attr("allowfullscreen","true").attr("frameborder","0").attr("src",url).addClass("tweet-media-video");
				break;
		}
	}

	/* Returns string: url */
	static getBestMediaVariant(variants) {
		let url;
		let max_bitrate = 0;

		variants.forEach(variant => {
			if (variant.content_type === "video/mp4") {
				if (variant.bitrate > max_bitrate) {
					max_bitrate = variant.bitrate;
					url = variant.url;
				}
			}
		});

		return url;
	}
}

exports.Media = Media;
