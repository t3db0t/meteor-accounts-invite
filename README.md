# Accounts-Invite

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

## How it works

- `accounts-invite` registers a custom login handler
- `loginWithInvite(token)` is called by host app
- temporary user is created
- User signs in with service of her choice (i.e. via `loginButtons`)
- `accounts-multiple` catches the 'switching' of accounts and checks that the token is provided in the current attempting user's account
- `accounts-add-service` merges the new service into the existing user record
- `onCreatedAccount` callback is called so you can, for instance, update an invitation status to "claimed"

## Known Issues
- I've observed a bug where the user is logged out if they attempt to sign back in too quickly