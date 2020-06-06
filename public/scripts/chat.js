var socket = io();

var defaultSheet = "default.css";
var darkSheet = "dark.css";
var styleIsDefault = true;
var emojiBoxIsOpen = false;

var sendTo = '';
var params = jQuery.deparam(window.location.search);

const sendIcon = document.getElementById('sendIcon');
const messageInput = document.getElementById('messageInput');
const chatCardBody = document.getElementById('chatCardBody');
const users = document.getElementById('users');
const chatCard = document.getElementsByClassName('chatCard');

/***  changing Style (DarkTheme or DefaultTheme) ***/
function changeStyle() {
    if (styleIsDefault === true) {
        document.getElementById("pageStyle").href = "./css/dark.css"; 
        /*document.getElementById("darkModeIcon").src = "./assets/icons/night.png";
        document.getElementById("userIcon").src = "./assets/icons/onHover Icons/028-user-1.png";
        document.getElementById("chatIcon").src = " ./assets/icons/onHover Icons/160-chat.png";
        document.getElementById("informationIcon").src = "./assets/icons/onHover Icons/056-information.png";
        document.getElementById("settingsIcon").src = "./assets/icons/onHover Icons/073-settings.png";
        document.getElementById("logOutIcon").src = "./assets/icons/onHover Icons/059-log-out.png";*/
        
    } else {
        document.getElementById("pageStyle").href = "./css/default.css";
        /*document.getElementById("darkModeIcon").src = "./assets/icons/white icons/night.png";
        document.getElementById("userIcon").src = "./assets/icons/white icons/028-user-1.png";
        document.getElementById("chatIcon").src = " ./assets/icons/white icons/160-chat.png";
        document.getElementById("informationIcon").src = "./assets/icons/white icons/056-information.png";
        document.getElementById("settingsIcon").src = "./assets/icons/white icons/073-settings.png";
        document.getElementById("logOutIcon").src = "./assets/icons/white icons/059-log-out.png";*/
    }

    styleIsDefault = !styleIsDefault;
}
/*** ------------------------------------------------- ***/


function createMessageRightHTML(messageContent) {
    return `<div class="message-right-container">
                <div class="message-right">
                    <p style="word-break: break-all;"> ${messageContent} </p>
                </div>
            </div>`;
}
function createMessageLeftHTML(messageContent) {
    return `<div class="message-left-container">
                <img src="./assets/icons/blue Icons/user.png" alt="" style="width: 90%; margin-top: 10px;">
                <div class="message-left">
                    <p style="word-break: break-all;"> ${messageContent} </p>
                </div>
            </div>`
}

function search() {
    // Declare variables
    var input, filter, ul, li, name, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("users");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        name = li[i].getElementsByTagName("div")[1].getElementsByTagName('h6')[0];
        txtValue = name.innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function showEmojiBox() {
    if (!emojiBoxIsOpen) {
        document.getElementById('emojiBox').style.display = "flex";
    } else {
        document.getElementById('emojiBox').style.display = 'none';
    }
    emojiBoxIsOpen = !emojiBoxIsOpen;
}
function addEmoji(emoji) {
    document.getElementById('messageInput').value += emoji;
}

function logOut() {
    location.href = "/";
    socket.emit('logOut', params.userName);
}

function displayMessage(conversation) {
    if (conversation) {
        chatCardBody.innerHTML = conversation;
    } else {
        chatCardBody.innerHTML = '';
    }
}

function getUserInfo(userName) {
    var params = jQuery.deparam(window.location.search);
    sendTo = userName ;
    socket.emit('getUserInfo', { receiver : userName, sender : params.userName} );
    document.getElementById(userName).style.backgroundColor = 'transparent';
}


messageInput.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("sendIcon").click();
    }
});

sendIcon.addEventListener("click", function () {
    if (sendTo) {
        socket.emit('sendMessage', { sender : params.userName ,receiver: sendTo, message: messageInput.value });
    } else {
    }
    messageInput.value = '';
});

socket.on('updateSenderConversation', function (conversation) {
    displayMessage(conversation);
});

socket.on('updateReceiverConversation', function (data) {

    if (sendTo === data.sender) {
        displayMessage(data.conv);
    } else {
        document.getElementById('notif').play();
        if (styleIsDefault) {
            document.getElementById(data.sender).style.backgroundColor = '#cff2cb';
        } else {
            document.getElementById(data.sender).style.backgroundColor = '#282828';
        }
        
    }
});

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params);
});


socket.on('updateUsersList', function (usersObj) {
    var usersListHTML = '';
    var params = jQuery.deparam(window.location.search);
    var users = {...usersObj.obj};
    currentUserName = params.userName;
    delete users[currentUserName];
    
    console.log(usersObj.list);
    
    Object.keys(users).forEach(function(key) {
        console.log(key,usersObj.list.includes(key) );
        
        if ( usersObj.list.includes(key) ) {
            usersListHTML += '<li onclick="getUserInfo(this.id)" id="' + key + '" class="onlineUsersListItem"><div class="onlineUserImage-container"><img class="onlineUserImage" src="./assets/icons/blue Icons/user (1).png" alt=""></div><div class="onlineUserName-container"><h6  class="onlineUserName">';
            usersListHTML += users[key].name + '</h6></div></li>';
        }
            
    });
    document.getElementById('users').innerHTML = usersListHTML;
});

socket.on('sendingUserInfo', function (usersData) {
    document.getElementById('chatting-userName').innerHTML = usersData.receiver.name;
    document.getElementById('welcomeCard').style.display = 'none';
    document.getElementById('chatCard').style.display = 'grid';

    // sendTo = usersData.receiver.id;
    if (usersData.sender.conversations[sendTo]) {
        chatCardBody.innerHTML = usersData.sender.conversations[sendTo];
    } else {
        chatCardBody.innerHTML = '';
    }
});

socket.on('forcedLogOut', ()=>{
    socket.emit('logOut', params.userName);
    alert('------')
})

function notWorking() {
    alert('We are Sorry. we are still working on this feature.');
}