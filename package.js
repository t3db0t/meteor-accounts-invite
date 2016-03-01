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
  api.use('ecmascript');
  api.use('t3db0t:accounts-multiple');
  api.addFiles('accounts-invite.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('t3db0t:accounts-invite');
  api.addFiles('accounts-invite-tests.js');
});
