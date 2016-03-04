Meteor.methods({
    'invitesCreate': function(inviteEmail){
        AccountsInvite.createInvitation(inviteEmail);
    },
    'invitesRequest': function(inviteEmail){
        AccountsInvite.createInviteRequest(inviteEmail);
    },
    'invitesVisited':function(token){
    	BetaInvites.update({"token":token}, {$set: {"status":"visited"}});
    },
    'invitesDelete':function(id){
    	BetaInvites.remove({"_id":id});
    },
    'invitesReset':function(id){
        BetaInvites.update({"_id":id}, {$set: {"status":"invited"}});
    },
    'invitesRevoke':function(id){
    	BetaInvites.update({"_id":id}, {$set: {"status":"revoked"}});
    },
    'deleteUser':function(id){
        Meteor.users.remove(id);
    }
});