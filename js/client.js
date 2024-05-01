const socket = io('http://localhost:8000');

// Get DOM elements in JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio
var audio = new Audio('notification.mp3');

// Function which will append event info to the container 
const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == "left"){
        audio.play();
    }
}

// If the form gets submitted, send server the message 
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`<b>You</b>: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
})

// Ask new user for his/her name
const name = prompt("Enter your name to join ");

// If a new user joins let the server know
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'left');
})

// If a new message is send by someone to server, then server send that msg to the other users
socket.on('receive',data=>{
    append(`<b>${data.name}</b>: ${data.message}`,'left');
})

// If a user leaves the chat,append the info to container
socket.on('left',name=>{
    append(`${name} left the chat`,'left')
})
