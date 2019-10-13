const {clipboard} = require("electron");

exports.TweetDropdown = [
	{label:"Copy link to Tweet",
	activate:(tweet)=>{
		let link = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;

		clipboard.writeText(link);
	}},
	{label:"Embed Tweet",
	activate:(tweet)=>{

	}},
	{label:"Share Tweet",
	activate:(tweet)=>{

	}},
	{label:"Like Tweet from...",
	activate:(tweet)=>{

	}},

	{divider:true},

	{label:"Tweet to user",
	activate:(tweet)=>{

	}},
	{label:"Follow user",
	activate:(tweet)=>{

	}},
	{label:"Message user",
	activate:(tweet)=>{

	}},
	{label:"Add/remove from List",
	activate:(tweet)=>{

	}},
	{label:"Add Tweet to Collection",
	activate:(tweet)=>{

	}},

	{divider:true},

	{label:"Mute user",
	activate:(tweet)=>{

	}},

	{label:"Block user",
	activate:(tweet)=>{

	}},

	{label:"Report Tweet",
	activate:(tweet)=>{

	}}
]
