# Accounts-Invite

**Live demo:** [http://accounts-invite-demo.meteor.com/](http://accounts-invite-demo.meteor.com/)

Don't you wish you could validate account creation in Meteor more flexibly? `accounts-invite` is a login validation extension for Meteor that supports OAuth services, not just accounts-password, and provides basic anonymous account functionality.

## Features
- Anonymous users: On demand, the current visitor can have a user record created that can have a service added to it
- Flexibly validate account creation: allow creation of accounts only if the client specifies a valid token, for instance

## The Problem
All the beta invitation systems for Meteor that I could find (such as [this one](https://themeteorchef.com/recipes/adding-a-beta-invitation-system-to-your-meteor-application/)) make password-based user accounts explicitly.  What I wanted was a way for the user to arrive at a special route that allows them to create an account with any service of their choice, including `password`.  This turns out to be nontrivial because of the limitations of Meteor's built-in validation methods.

What's required is a way to allow Oauth (or `accounts-password`) account creation ONLY when we want, i.e. at an `acceptInvitation` route with a token, and deny account creation everywhere else, yet still allow registered users to login with the regular login buttons.  Meteor's `validateLoginAttempt` and `validateNewUser` methods are called by the server, which has no way of knowing about your client-side token.

## The Solution

`accounts-validate` exposes a special login method (`loginWithInvite`) that creates a temporary, anonymous user with a token supplied by your app (i.e. at an `acceptInvitation` route). That token can then be verified by login validation callbacks.  `accounts-invite` depends on these packages:

- [`brettle:accounts-add-service`](https://github.com/brettle/meteor-accounts-add-service/) - Adds a login service to the temporary user account
- [`brettle:accounts-patch-ui`](https://github.com/brettle/meteor-accounts-patch-ui/) - Makes `loginButtons` act like there isn't a user logged in when the initial, temporary user is created
- [`t3db0t:accounts-multiple`](https://github.com/t3db0t/meteor-accounts-multiple) - A fork of [`brettle:accounts-multiple`]() that adds an additional callback to handle the case of disallowed logins (`noAttemptingUser`)

## API

- `Meteor.loginWithInvite(token, [optionsObject])` (Client)
	- `token` can by any string of your choice, i.e. `Random.id(n)`
	- `optionsObject` could be used if your app needs more than one separate validation system/area
- `validateToken(token, options)` (Server)
	- return `true` to allow account registration
	- return `false` to deny
- `onCreatedAccount(token, user)` (Server)
	- called when the account is successfully registered
	- `token`: the token used in `loginWithInvite`
	- `user`: the user record that was created

## How it works

- `accounts-invite` registers a custom login handler
- `loginWithInvite(token)` is called by host app
- temporary user is created
- User signs in with service of her choice (i.e. via `loginButtons`)
- `accounts-multiple` catches the 'switching' of accounts and calls `validateToken()`. If that returns true,
- `accounts-add-service` merges the new service into the existing user record
- `onCreatedAccount` callback is called so you can, for instance, update an invitation status to "claimed"
- You should still be able to use `Accounts.validateNewUser` as normal.
- Note: `Accounts.onLoginFailure` will show some 'failures' as part of the normal operation of this system, due to i.e. `brettle:accounts-add-service`. You can safely ignore these.

### Example

```js
// server
AccountsInvite.register({
	validateToken: validateToken,
	onCreatedAccount: onCreatedAccount
});

function validateToken(token){
	if(InvitesCollection.findOne({"token":token})) return true;
	else return false;
}

function onCreatedAccount(token, user){
	InvitesCollection.update({"token":token}, {$set:{"status":"claimed"}});
	// Here you could also do something like...
	// Roles.addUsersToRoles(user._id, ['beta-permissions']);
}

// client
Meteor.loginWithInvite(token);
```

## Known Issues
- I've observed a bug where the user is logged out if they attempt to sign back in too quickly

## Acknowledgements
I'm indebted to [`brettle`](https://github.com/brettle) for his [help in figuring out](https://github.com/brettle/meteor-accounts-deluxe/issues/4) how to make this work.