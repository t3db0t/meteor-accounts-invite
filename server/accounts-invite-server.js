AccountsInvite.register = function(cbs){
  check(cbs, Object);

  if(cbs.validateToken){
    AccountsInvite.validateToken = cbs.validateToken;
  }
  if(cbs.onCreatedAccount){
    AccountsInvite.onCreatedAccount = cbs.onCreatedAccount;
  }
  if(cbs.onSwitch){
    AccountsInvite.onSwitch = cbs.onSwitch;
    console.log('setting onSwitch');
    console.log(AccountsInvite.onSwitch);
  }
  if(cbs.validationOptions){
    AccountsInvite.validationOptions = cbs.validationOptions;
  } else {
    AccountsInvite.validationOptions = {};
  }
}

AccountsMultiple.register({
  onNoAttemptingUser: noAttemptingUserCallback,
  validateSwitch: validateSwitchCallback,
  onSwitch: onSwitch,
  onSwitchFailure: onSwitchFailureCallback
});

function onSwitch(attemptingUser, attempt){
  AccountsInvite.onSwitch(attemptingUser, attempt);
}

// Works like validateLoginAttempt but only called from t3db0t:accounts-multiple
function noAttemptingUserCallback(attempt){
  // console.log("noAttemptingUserCallback");
  // console.log(attempt);
  if(! attempt.user.services.accountsInvite){
    // delete the user record that was created in the attempt
    // console.log("No accountsInvite; canceling login");
    Meteor.users.remove({"_id":attempt.user._id});
    // return false;
    throw new Meteor.Error("not-invited-public", "Sorry, Beta invitations only for now!");
  } else return true;
}

/* Works just like Accounts.validateLoginAttempt() except that the attempting
   user is available.
   attemptingUser = OLD/initial account (i.e. guest/anonymous)
     - has user schema
   attempt = NEW/'real' account (i.e. facebook login)
     {
       type: 'facebook',
       user: { ... },
       ...
     }
*/
function validateSwitchCallback(attemptingUser, attempt) {
  // console.log("validateSwitchCallback");
  // console.log(attemptingUser);
  // console.log("---");
  // console.log(attempt);
  // console.log("----------------");

  if(AccountsInvite.onValidateSwitch){
    // provides a user callback for any other account-switching stuff you need to do
    AccountsInvite.onValidateSwitch(attemptingUser, attempt);
  }

  // check for existence of accountsInvite record
  if (attemptingUser.services.accountsInvite) {
    // return entire accountsInvite object
    return AccountsInvite.validateToken(attemptingUser.services.accountsInvite);
  } else {
    throw new Meteor.Error("not-invited", "This login attempt somehow wasn't using accounts-invite");
  }
}

// Captures the expected 'failure' to switch to a new account
/* Works just like Accounts.onLoginFailure() callback except it's strictly
/* called when a logged in user fails when logging in using a different service,
/* and it provides the attempting user. */
function onSwitchFailureCallback(attemptingUser, attempt){
  // console.log("onSwitchFailureCallback");
  // console.log(attempt);
  // console.log("--------------");
  
  // WARNING: Super hacky / brittle. This needs to check that the error is specifically produced
  // by brettle:accounts-add-service, and I'm currently not aware of a better way to do this.
  // If accounts-add-service changes this error message, this will break!
  if(attemptingUser.services.accountsInvite && attempt.error.reason.includes("New login not needed")){
    // The attempt is using Accounts-Invite, let them in.
    // Send the whole Invite object
    AccountsInvite.onCreatedAccount(attemptingUser, attempt);
  } else {
    console.log("accounts-add-service failed");
  }
}

// Register a client login handler that either logs in an existing user with the specified invitation token, or creates a new user record with that token.

Accounts.registerLoginHandler("accounts-invite", function(loginRequest) {
  // console.log("accounts-invite loginHandler");
  // console.log(loginRequest);

  if (!loginRequest || !loginRequest.options.inviteToken || Meteor.userId()) {
    return new Meteor.Error("invalid-invitation-login", "No options, no token, or already logged in");
  }

  var userId;
  // TODO: Check this better
  var existingUser = Meteor.users.findOne({ 'services.accountsInvite': loginRequest.options});
  if (existingUser) {
    userId = existingUser._id;
  } else {
    userId = Accounts.insertUserDoc(loginRequest, {
      services: {
        'accountsInvite': loginRequest.options
      }
    });
  };

  return { userId: userId };
});