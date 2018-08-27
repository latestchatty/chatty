Chatty
---

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

Technology Used
---

* [React](https://reactjs.org/) (Rendering / Components)
* [React-router](https://github.com/ReactTraining/react-router) (Routing)
* [Material-ui](https://material-ui.com/) (UI Framework / Google Material Design)
* [Create-Create-App](https://github.com/facebook/create-react-app) (Zero config build system)
