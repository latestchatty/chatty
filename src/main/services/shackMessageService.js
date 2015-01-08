angular.module('chatty')
    .service('shackMessageService', function(settingsService, apiService) {
       var shackMessageService = {};
       
       shackMessageService.totalMessageCount = '...';
       
       shackMessageService.getTotalMessageCount = function () { 
          return shackMessageService.totalMessageCount;
       }
       
       shackMessageService.refresh = function () {
          if(settingsService.isLoggedIn())
          {
             apiService.getTotalInboxCount(settingsService.getUsername(), settingsService.getPassword())
               .success(function(data) {
                 shackMessageService.totalMessageCount = data.totalMessages;
               })
               .error(function (data) {
                 shackMessageService.totalMessageCount = -1;
               });
          }
       }
       
       return shackMessageService;
    });