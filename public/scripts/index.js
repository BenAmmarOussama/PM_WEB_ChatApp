var socket = io();
var list = [];


socket.emit('getusernames');
socket.on('usernames', function(usernamesList){
    list = [...usernamesList];
});
socket.on('disconnect', ()=> {
    console.log('discnnected index', socket.id);
    
})




function validateForm() {
    var userName = document.forms["myForm"]["userName"].value;
    var name = document.forms["myForm"]["name"].value;
    if (userName == "" || name == "") {
        alert("All fields must be filled out");
        return false;
    }
    if (list.includes(userName)) {
        alert("This user name is taken. Please chose another one");
        return false;
    }
    
    list.push(userName);
}
