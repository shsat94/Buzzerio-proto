const socket = io("http://localhost:8000");

const name = prompt("Enter your name");
const roomId = prompt("Enter room id ");
const createRoom=document.querySelector('#create');
const joinRoom=document.querySelector('#join');

createRoom.addEventListener('click',()=>{
    socket.emit('create-room',roomId,name);
});

joinRoom.addEventListener('click',()=>{
    socket.emit('join-room',roomId,name);
});

socket.on('room-present',()=>{
    alert("room is already present");
})