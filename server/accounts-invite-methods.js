Meteor.methods({
    'invitesCreate': function(inviteEmail){
        console.log("createBetaInvite: "+inviteEmail);
        AccountsInvite.createInvitation(inviteEmail);
    },
    'invitesVisited':function(token){
    	BetaInvites.update({"token":token}, {$set: {"status":"visited"}});
    },
    'invitesDelete':function(id){
    	BetaInvites.remove({"_id":id});
    },
    'invitesRevoke':function(id){
    	BetaInvites.update({"_id":id}, {$set: {"status":"revoked"}});
    }
});