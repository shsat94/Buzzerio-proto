// const socket = io("http://localhost:8000");


const create = document.querySelector('#create');
const join = document.querySelector('#join');
const createRoomForm = document.querySelector('.createroom');
const joinRoomForm = document.querySelector('.joinroom');
const container = document.querySelector('.container');
const creatorDashboard = document.querySelector(".room-creator-dashboard");
const memberDashboard = document.querySelector(".room-member-dashboard");

const buzzer=document.querySelector('.buzzer-button');
const memberlist = document.querySelector('.memberlist');
//creation and joining submit buttons
const createRoom = document.querySelector('#submit-create-room');
const joinRoom = document.querySelector('#submit-join-room');

const Hname = document.querySelector('#hostname');

const member = document.querySelector('#membername');
const enteredroomID = document.querySelector('#roomid');

//none display in begining
// container.classList.add("none");
createRoomForm.classList.add("none");
joinRoomForm.classList.add('none');
creatorDashboard.classList.add('none');
memberDashboard.classList.add('none');

//functions
const RoomCreation = (e) => {
    e.preventDefault();
    const hostname = Hname.value;
    createRoomForm.classList.add("none");
    creatorDashboard.classList.remove('none');
    socket.emit('create-room', hostname);

}

const Roomjoining = (e) => {
    e.preventDefault();
    const roomId = enteredroomID.value;
    const membername = member.value;
    joinRoomForm.classList.add('none');
    memberDashboard.classList.remove('none');
    socket.emit('join-room', roomId, membername);
}

//event listners

create.addEventListener('click', () => {
    container.classList.add("none");
    createRoomForm.classList.remove("none");
    createRoom.addEventListener('click', RoomCreation);
});

join.addEventListener('click', () => {
    container.classList.add("none");
    joinRoomForm.classList.remove("none");
    joinRoom.addEventListener('click', Roomjoining);

});

socket.on('room-present', () => {
    alert("room is already present");
});


socket.on('room-details', (membername) => {
    const mem = document.createElement('p');
    mem.innerHTML = `${membername}`;
    mem.classList.add('members');
    console.log(mem);
    memberlist.append(mem);
});

