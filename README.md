SnailTracker JS (In Development)
===============
The JS component to [SnailTracker](https://github.com/snailtracker/snailtracker-server)!

First, make sure you setup your SnailTracker server.  Then come back and implement this script.

This is still in development, but it's almost ready.  You will simply need to include snailtracker.min.js, and include the following:
```
$(function(){
    SnailTracker.api_url = "http://your-app-url.com";
    SnailTracker.api_key = "the-app-api-key-you-generated-for-this-web-app";
    SnailTracker.initialize();
});
```

And it will start tracking your users!

TODO
----
There are still a few very important things to wrap up first:
1.  (DONE) Ignore password fields and anything that looks like a credit card (12-18 numbers).

2.  Cache the results locally before sending (instead of sending hundreds of requests).

3.  Actually get the JS combined and minified.

4.  Expire the session after 24 hours of inactivity.

License
-------
AGPL
