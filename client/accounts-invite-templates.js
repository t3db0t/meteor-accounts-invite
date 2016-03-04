Template.inviteLogin.helpers({
  "inviteStatus":function(){
    // this.token must be set in data context in the implementing template,
    // i.e. {{> inviteLogin token=token}}
    var token = this.token;
    var invite = BetaInvites.findOne({"token":token});
    if(!invite) return "inviteInvalid";
    if(invite.status == "invited"){
      // do Accounts-Invite login - but only do it once on token validation
      Meteor.loginWithInvite(invite);
      return "inviteInvited";
    } else if(invite.status == "visited"){
      return "inviteVisited";
    } else if(invite.status == "claimed"){
      return "inviteClaimed";
    }
  }
});

Template.inviteAdmin.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('betaInvites');
    self.subscribe('allUsers');
  });
});

Template.inviteAdmin.helpers({
  "datetime":function(){
    var d = new Date(this.createdAt);
    return d.toLocaleString();
  },
  "invites":function(){
    return BetaInvites.find();
  },
  "users":function(){
    return Meteor.users.find();
  },
  "inviteToken":function(){
    var t = "";
    if(this.services.accountsInvite){
      t = this.services.accountsInvite.token;
    }
    return t;
  },
  "services":function(){
    // String of services registered to this user
    return _.chain(this.services)
      .map(function(v,k,l){ return k })
      .filter(function(k){ return k != "resume"})
      .value()
      .join(" | ");
  }
});

Template.inviteAdmin.events = {
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
  },
  'click a.user-delete':function(e,t){
    Meteor.users.remove($(e.currentTarget).attr('data-id'));
    // Meteor.call("deleteUser", )
  }
};