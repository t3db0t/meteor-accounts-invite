Package.describe({
  name: 't3db0t:accounts-invite',
  version: '1.1.0',
  summary: 'Account validation with oauth and anonymous user support',
  git: 'https://github.com/t3db0t/meteor-accounts-invite',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.export('AccountsInvite');
  
  api.use(['accounts-base'], 'server');
  api.use(['check', 't3db0t:accounts-multiple@0.3.2', 'brettle:accounts-patch-ui@0.1.10', 'brettle:accounts-add-service@1.0.0']);

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth services.
  // Required in this case or else oauth services don't get called, and AccountsInvite gets called instead--not sure why
  api.use('accounts-oauth', {weak: true});
  // Needed for accounts-ui and to prevent above problem
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'lib/accounts-invite.js',
  ]);

  api.addFiles([
    'server/accounts-invite-server.js',
  ], 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('t3db0t:accounts-invite');
  api.addFiles('accounts-invite-tests.js');
});
