AccountsInvite = {};

Meteor.loginWithInvite = function(token){
  check(token, String);
  // Meteor.call("invitesVisited", token);

  var callback = function(){};

  Accounts.callLoginMethod({
    methodArguments: [{
      inviteToken: token
    }],
    userCallback: function (error) {
      if (error) {
        if (callback) { callback(error); }
      } else {
        if (callback) { callback(); }
      }
    }
  });
}