Package.describe({
  name: 't3db0t:accounts-invite',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'An invitation system with oauth and anonymous user support',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/t3db0t/meteor-accounts-invite',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  // api.use('ecmascript');
  
  
  api.use(['templating', 'blaze-html-templates'], 'client');
  
  api.use(['accounts-base'], ['client', 'server']);
  api.use('t3db0t:accounts-multiple');

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth
  // services.
  // api.use('accounts-oauth', {weak: true});
  // Allow us to directly test if accounts-password (which doesn't use
  // Accounts.oauth.registerService) exists.
  // api.use('accounts-password', {weak: true});

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

  // api.addFiles([
  //   'client/accounts-invite-templates.js'
  // ], 'client');

  api.export('AccountsInvite');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('t3db0t:accounts-invite');
  api.addFiles('accounts-invite-tests.js');
});
