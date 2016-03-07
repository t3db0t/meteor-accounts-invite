AccountsInvite = {};

// AccountsInvite.onCreatedAccount = function(token){}
// AccountsInvite.onInvalidToken
// 

AccountsInvite.register = function(cbs){
  if(cbs.onCreatedAccount){
    AccountsInvite.onCreatedAccount = cbs.onCreatedAccount;
  }
}

Meteor.loginWithInvite = function(token){
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