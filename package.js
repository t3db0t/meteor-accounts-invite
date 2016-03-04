Package.describe({
  name: 't3db0t:accounts-invite',
  version: '0.0.1',
  summary: 'An invitation system with oauth and anonymous user support',
  git: 'https://github.com/t3db0t/meteor-accounts-invite',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.export('AccountsInvite');
  
  api.use(['templating', 'blaze-html-templates', 'accounts-ui'], 'client');
  api.use(['accounts-base', 'random', 'email'], 'server');
  api.use(['t3db0t:accounts-multiple', 'brettle:accounts-patch-ui', 'brettle:accounts-add-service']);

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth services.
  // Required in this case or else oauth services don't get called, and AccountsInvite gets called instead--not sure why
  api.use('accounts-oauth', {weak: true});
  // Needed for accounts-ui and to prevent above problem
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'client/accounts-invite-templates.html',
    'client/accounts-invite-templates.js',
    'client/accounts-invite-templates.css',
  ], 'client');

  api.addFiles([
    'lib/accounts-invite.js',
    'lib/collections.js'
  ]);

  api.addFiles([
    'server/accounts-invite-server.js',
    'server/accounts-invite-methods.js',
    'server/publications.js'
  ], 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('t3db0t:accounts-invite');
  api.addFiles('accounts-invite-tests.js');
});
