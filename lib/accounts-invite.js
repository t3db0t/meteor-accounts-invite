AccountsInvite = {};

Meteor.loginWithInvite = function(invite){
  Meteor.call("invitesVisited", invite.token);

  var callback = function(){};
  Accounts.callLoginMethod({
    methodArguments: [{
      inviteToken: invite.token
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