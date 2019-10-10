const {make, div, body} = require("./Helpers.js");

class ProfileMiniCard {
	constructor(profileData, position) {
		console.log("IM THE MINI CARD! :D");
		console.log(profileData);
		console.log(position);
		this.profilePic = make("img").attr("src", profileData.profile_image_url_https).addClass("tweet-profile-pic");
		this.displayName = div("tweet-display-name").text(profileData.name);
		this.username = div("tweet-username txt-mute").text("@" + profileData.screen_name);
		this.usernameGroup = div("tweet-username-group").append(this.displayName, this.username);
		this.bio = div("minicard-bio").text(profileData.description);
		this.element = div("minicard").append(this.profilePic, this.usernameGroup, this.bio).css(position)

		.on("mouseout", (e) => {
			console.log(e);

			if (!this.element[0].contains(e.relatedTarget)) {
				this.element.remove();
				this.profilePic = undefined;
				this.displayName = undefined;
				this.username = undefined;
				this.usernameGroup = undefined;
				this.bio = undefined;
				this.element = undefined;
			}
		})
		
		$("body").append(this.element);
	}
}

exports.ProfileMiniCard = ProfileMiniCard;
