Meteor.publish("betaInvites", function () {
  return BetaInvites.find();
});

Meteor.publish("inviteTokens", function (token) {
  return BetaInvites.find({"token":token}, {fields: {'status':1, 'token':1}});
});