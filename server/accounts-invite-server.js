AccountsMultiple.register({
  onNoAttemptingUser: noAttemptingUserCallback,
  validateSwitch: validateSwitchCallback,
  // onSwitch: onSwitchCallback,
  onSwitchFailure: onSwitchFailureCallback
});

// Works like validateLoginAttempt but only called from AccountsMultiple
function noAttemptingUserCallback(attempt){
  console.log("noAttemptingUserCallback");
  // console.log(attempt);
  if(! attempt.user.services.accountsInvite){
    // delete the user record that was created in the attempt
    console.log("No accountsInvite; canceling login");
    Meteor.users.remove({"_id":attempt.user._id});
    // return false;
    throw new Meteor.Error("not-invited-public", "Sorry, Beta invitations only for now!")
  } else return true;
}

/* Works just like Accounts.validateLoginAttempt() except that the attempting
/* user is available. */
function validateSwitchCallback(attemptingUser, attempt) {
  console.log("validateSwitchCallback");
  console.log(attemptingUser);
  if (attemptingUser.services.accountsInvite.token) {
    return true;
  } else {
    throw new Meteor.Error("not-invited", "This login attempt somehow wasn't using accounts-invite");
  }
}

/* Works just like Accounts.onLoginFailure() callback except it's strictly
/* called when a logged in user fails when logging in using a different service,
/* and it provides the attempting user. */
function onSwitchFailureCallback(attemptingUser, attempt){
  console.log("onSwitchFailureCallback");
  if(attemptingUser.services.accountsInvite && attempt.error){
    // The attempt is using Accounts-Invite, let them in. The error is produced by brettle:accounts-add-service.
    // Update user's invitation status to "claimed"
    // console.log("--> claiming invite");
    // BetaInvites.update({"token":attemptingUser.services.accountsInvite.token}, {$set:{"status":"claimed"}});
    AccountsInvite.onCreatedAccount(attemptingUser.services.accountsInvite.token);
  } else {
    console.log("accounts-add-service failed");
  }
}

Accounts.onLoginFailure(function(attempt){
  console.log("------------------------");
  console.log("Accounts.onLoginFailure");
  console.log(attempt);
  console.log("------------------------");
});

AccountsInvite.createInviteRequest = function(requestEmail){
  // For beta signup requests
  var m = BetaInvites.insert({
    "token": "",
    "status": "requested", // requested, invited, visited (reached accept page but didn't claim), claimed
    "email": requestEmail,
    "createdAt": new Date(),
    "userId": ""   // associated with actual user account when registered
  });

  // Send invite request confirmation

}

AccountsInvite.createInvitation = function(inviteEmail){
  // generate invite hash
  // insert beta invite record
  var token = Random.id(8);
  var m = BetaInvites.insert({
    "token": token,
    "status": "invited", // requested, invited, visited (reached accept page but didn't claim), claimed
    "email": inviteEmail,
    "createdAt": new Date(),
    "userId": ""   // associated with actual user account when registered
  });

  // send Invite email
  AccountsInvite.sendInviteEmail(token, inviteEmail);
}

AccountsInvite.sendInviteEmail = function(token, inviteEmail){
  var host = Meteor.absoluteUrl();
  var body = 'Thanks for your interest in my app!\n\<a href="'+host+'acceptInvite/'+token+'">Click here</a> to claim your invitation and create an account.';
  var options = {
      from: "My App <hi@app.io>",
      to: inviteEmail,
      subject: 'Welcome to my App Beta!',
      text: body,
      // headers: "Content-Type: text/html; charset=ISO-8859-1\r\n"
  };

  Email.send(options);
}

// Register a client login handler that either logs in an existing user with the specified invitation token, or creates a new user record with that token.

Accounts.registerLoginHandler("accounts-invite", function(options) {
  console.log("accounts-invite loginHandler");
  if (!options || !options.inviteToken || Meteor.userId()) {
    return new Meteor.Error("invalid-invitation-login", "No options, no token, or already logged in");
  }

  var userId;
  var existingUser = Meteor.users.findOne({ 'services.accountsInvite.token': options.inviteToken});
  if (existingUser) {
    userId = existingUser._id;
  } else {
    userId = Accounts.insertUserDoc(options, {
      services: {
        'accountsInvite': {
          token: options.inviteToken
        }
      }
    });
  };

  return { userId: userId };
});