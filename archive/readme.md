Chatty
====
A single-page-application alternative client for the shacknews chatty (http://www.shacknews.com/chatty).

Features above standard chatty:
* Event based: Replies and new root posts are loaded live. No more F5 necessary.
* Reflow action: Re-sorts the chatty instantly, active posts on top, no http call required.
* Live filtering. No more reposts! Filter works without API call in the background (against live threads only).
* Content embed in-post for: raw images, imgur (gifv, albums), gfycat, youtube, vimeo.
* Tabs support:
  * Save a post, author, filter, etc for later quick filtering.
  * Default tabs include: Chatty (all threads), Frontpage (Shacknews posts), Mine (threads containing your username)
* Collapsed post ids are stored in the cloud. Compatible with any other WinChatty V2 cloud collapse using app.
* Collapsing a post eliminates it from view entirely, saving performance. Collapsed posts are still available to search via live filtering.

##### Example Site
http://chatty.nixxed.com

##### How to run:
---------
Notes
  1. Uses webpack-dev-server, not a real web server
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

##### How to test production build locally:
---------
Notes:
  1. Hosts whatever is in the 'build' directory
  2. Access it at http://localhost:3000
~~~~
npm run server
~~~~

Technology Used
---

* [Angular2](https://angular.io/) (SPA Framework)
* [TypeScript](https://github.com/Microsoft/TypeScript) (Language)
* [Webpack](http://webpack.github.io/docs/) (Build automation)
