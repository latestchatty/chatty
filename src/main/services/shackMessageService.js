angular.module('chatty')
    .service('shackMessageService', function($window, settingsService, apiService) {
       var shackMessageService = {};
       
       shackMessageService.totalMessageCount = '...';
       shackMessageService.unreadMessageCount = '...';
       
       shackMessageService.getTotalMessageCount = function () { 
          return shackMessageService.totalMessageCount;
       }
       
       shackMessageService.getUnreadMessageCount = function () { 
          return shackMessageService.unreadMessageCount;
       }
       
       shackMessageService.refresh = function () {
          if(settingsService.isLoggedIn())
          {
             apiService.getTotalInboxCount(settingsService.getUsername(), settingsService.getPassword())
               .success(function(data) {
                 shackMessageService.totalMessageCount = data.total;
                 shackMessageService.unreadMessageCount = data.unread;
               })
               .error(function (data) {
                 shackMessageService.totalMessageCount = -1;
                 shackMessageService.unreadMessageCount = -1;
               });
          }
       };
       
       shackMessageService.goToInbox = function () {
           $window.open("https://www.shacknews.com/messages", "_blank");
       };
       
       return shackMessageService;
    });