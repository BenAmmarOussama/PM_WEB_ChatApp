var socket = io();
var list = [];

socket.emit('getusernames');
socket.on('usernames', function(usernamesList){
    list = [...usernamesList];
    console.log(list);
    
});

socket.on('disconnect', ()=> {
    console.log('discnnected index', socket.id);
})




function validateForm() {
    
    var userName = document.forms["myForm"]["userName"].value;
    var name = document.forms["myForm"]["name"].value;
    console.log( list.includes(userName) );
    
    if (userName == "" || name == "") {
        alert("All fields must be filled out");
        return false;
    }
    if (list.includes(userName)) {
        alert("This user name is taken. Please chose another one");
        return false;
    }
    
    //list.push(userName);
}

function myFunction() {
    myVar = setTimeout(function(){ alert("Hello"); }, 3000);
  }