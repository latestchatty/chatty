Chatty
====
A web based alternate client for the shacknews chatty (http://www.shacknews.com/chatty).

Features above standard chatty:
* Reduced page load size / time.
  * Shacknews is ~1.2mb / ~125 http requests
  * This version is ~175kb / 11 http requests (aiming to get this smaller still)
* Event based: Replies and new root posts are loaded live. No more F5 necessary.
* Live filtering. No more reposts! Filter works without API call in the background (against live threads only).
* Collapsed posts are remembered, no browser extension required.
* Collapsing a post pushes it to the end of the chatty, out of the way.
* New reply indicator on posts you haven't viewed. Click to put the post into a live refresh mode.

##### Example Site
http://chatty.nixxed.com

##### How to run:
---------
Notes
  1. Uses gulp-connect, IE not a real web server
  2. Access it at http://localhost:3000
~~~~
npm start
~~~~

##### How to build for production use:
---------
Notes:
  1. Creates 'build' directory
  2. Serve build dir as the public root
~~~~
npm run build
~~~~
