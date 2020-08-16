# Project Nova (MD10)
 
Project Nova (NOT the final name) is an early prototype open-source TweetDeck clone which is designed to be fast and beautiful.

While a promising project, Electron just did not have the performance we needed to do this right, and issues with the authentication system made this impossible.

## Features

Implemented features include:

* View tweets and notifications (notifications are broken due to a bizarre V8 quirk)
* Syncs with TweetDeck (as it stands, only TweetDeck -> Nova)
* Compose tweets and reply to people
* Like tweets
* Retweet tweets
* Hover over someone's profile picture to get a preview of their profile


## Logging in

Nova does not have a login user interface. Credentials are supplied manually in console.

```
StorageAccount.saveAccount{
 twitterId: Number,
 userName: String,
 authToken: String,
 bearerToken: String
}
```

twitterId, authToken, bearerToken can be found by looking at a network request from a currently logged in session of TweetDeck.
![https://github.com/dangeredwolf/nova-twitter/raw/master/docs/Screenshot_7015.png](https://github.com/dangeredwolf/nova-twitter/raw/master/docs/Screenshot_7015.png)

`authToken` is the thing under auth_token in cookie

`twitterId` is the number itself displayed by twid in cookie

`bearerToken` is the Authorization token, excluding "Bearer "

`userName` is your user name.
