AccountsInvite = {};

Meteor.loginWithInvite = function(options, callback){
  // check(token, String);
  check(options, Object);
  
  if(!callback)
    callback = function(){};

  Accounts.callLoginMethod({
    methodArguments: [{
      options: options
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