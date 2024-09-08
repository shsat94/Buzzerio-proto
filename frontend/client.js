const socket = io("http://localhost:8000");


const create = document.querySelector('#create');
const join = document.querySelector('#join');
const createRoomForm = document.querySelector('.createroom');
const joinRoomForm = document.querySelector('.joinroom');
const container = document.querySelector('.container');
const creatorDashboard = document.querySelector(".room-creator-dashboard");
const memberDashboard = document.querySelector(".room-member-dashboard");
const leaderboard = document.querySelector('.player-data');

const leaderboardhostN = document.querySelector('#hostN');
const leaderboardroomI = document.querySelector('#roomI');

const joinleaderboard = document.querySelector('.join-leaderboard-body');

const buzzer = document.querySelector('.buzzer-button');
const memberlist = document.querySelector('.memberlist');

const reset=document.querySelector('#reset');
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

let roomId = '';
let membername = '';
let position = 0;
let firstInstance = '';


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
    roomId = enteredroomID.value;
    membername = member.value;
    joinRoomForm.classList.add('none');
    memberDashboard.classList.remove('none');
    socket.emit('join-room', roomId, membername);
}

const formatTimestamp = (date) => {
    const seconds = Number(String(date.getSeconds()));
    const milliseconds = Number(String(date.getMilliseconds()));
    timeinms = (seconds) * 1000 + milliseconds;
    return timeinms;
}


const removemembername=(name)=>{
    const totalmembers=memberlist.getElementsByTagName('p');
    for(let i =0;i<totalmembers.length;i++){
        if(totalmembers[i].innerText===name){
            memberlist.removeChild(totalmembers[i]);
            break;
        }
    }
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



buzzer.addEventListener('click', () => {
    buzzer.disabled = true;
    const pressedtime = new Date();
    const clickedtime = formatTimestamp(pressedtime);
    socket.emit('clicked-time', roomId, membername, clickedtime);

})


socket.on('room-present', () => {
    alert("room is already present");
});


socket.on('room-details', (membername) => {
    const mem = document.createElement('p');
    mem.innerHTML = `${membername}`;
    mem.classList.add('members');
    memberlist.append(mem);
});


socket.on('press-info', (memname, time) => {
    position = position + 1;
    if (position === 1) {
        firstInstance = time;
    }
    const extratime = time - firstInstance;

    const led = document.createElement('tr');
    led.classList.add('center');
    led.innerHTML = `<td style="width: 30%;">${memname}</td>
                        <td style="width: 40%;">+${extratime} ms</td>
                        <td>${position}</td>`;

    leaderboard.append(led);

    const joinled = document.createElement('tr');
    joinled.innerHTML = `<td>${memname}</td>
                        <td>+${extratime} ms</td>
                        <td>${position}</td>`;

    joinleaderboard.append(joinled);

})


socket.on('creator-room-info', (hostnm, roomiden) => {
    roomId=roomiden;
    leaderboardhostN.innerText = `HOSTNAME - ${hostnm}`;
    leaderboardroomI.innerText = `ROOMID   - ${roomiden}`;
})


reset.addEventListener('click',()=>{
    socket.emit('reset',roomId);
});

socket.on('reset-leaderboard',()=>{
    buzzer.disabled=false;
    leaderboard.innerHTML=' ';
    joinleaderboard.innerHTML=' ';
    position=0;

});

socket.on('disconnected',(name)=>{
    removemembername(name);
})
