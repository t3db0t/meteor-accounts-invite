Template.acceptInvite.onCreated(function(){
  // template-level subscription to invite state
  var self = this;
  self.autorun(function() {
    var token = Router.current().params._token;
    self.subscribe('inviteTokens', token);
  });
});

Template.acceptInvite.helpers({
  "token":function(){
    return Router.current().params._token;
  }
});


Template.inviteLogin.helpers({
  "inviteStatus":function(){
    // this.token must be set in data context in the implementing template,
    // i.e. {{> inviteLogin token=token}}
    var token = this.token;
    var invite = BetaInvites.findOne({"token":token});
    if(!invite) return "invite-invalid";
    if(invite.status == "invited"){
      // do Accounts-Invite login - but only do it once on token validation
      Meteor.loginWithAccountsInvite(invite);
      return "invite-invited";
    } else if(invite.status == "visited"){
      return "invite-visited";
    } else if(invite.status == "claimed"){
      return "invite-claimed";
    }
  }
});

Template.invites.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('betaInvites');  
  });
});

Template.invites.helpers({
  "datetime":function(){
    var d = new Date(this.createdAt);
    return d.toLocaleString();
  },
  "invites":function(){
    return BetaInvites.find();
  },
  "users":function(){
    return Meteor.users.find();
  }
});

Template.invites.events = {
  'submit form': function (event, template) {
    event.preventDefault();
    var inviteEmail = template.find('#inviteEmail').value;
    Meteor.call('invitesCreate', inviteEmail);
  },
  'click a.invite-revoke': function(e,t) {
    Meteor.call("invitesRevoke", $(e.currentTarget).attr('data-id'));
  },
  'click a.invite-delete': function(e,t) {
    Meteor.call("invitesDelete", $(e.currentTarget).attr('data-id'));
  }
};