class Users {
    static count = 0;

    constructor () {
        this.usersObj = {};
    }

    addUser(userName, name) {
        var user = {name, conversations : {} }
        this.usersObj[userName] = user;
    }

    addMsgToConversation(senderUserName, receiverUserName, message){
        if (this.usersObj[senderUserName].conversations[receiverUserName]){
            this.usersObj[senderUserName].conversations[receiverUserName] += message ;
        } else {
            this.usersObj[senderUserName].conversations[receiverUserName] = message ;
        }
    }

    getConversation(userName, conversationId) {
        return this.usersObj[userName].conversation[conversationId] ;
    }

    getUser(userName) {
        return this.usersObj[userName];
    }
    /*
    getUserNumber(id) {
        return this.users.filter( (user) => user.id === id)[0].number;
    }
    */
    removeUser(userName) {
        var user = this.getUser(userName);
        if (user){
            delete this.usersObj[userName];
        }
        return user;
    }
}

module.exports = {Users};