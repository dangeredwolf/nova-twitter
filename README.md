# Project Nova (MD10)
 
Project Nova (NOT the final name) is an early prototype open-source TweetDeck clone which is designed to be fast and beautiful.


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

twitterId: You can check a website like https://tweeterid.com/ to find this
