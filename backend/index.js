const io = require('socket.io')(8000, { cors: { origin: "*" } });
let rooms = [];

let namemap={};


const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

io.on('connection', socket => {
    namemap[socket.id]={};
    const roomId= generateRoomId();
    socket.on('create-room', (hostName) => {
        if (rooms.length < 1) {

            socket.join(roomId);
            let roomdetails = {
                roomId: roomId,
                host: hostName,
                members: []
            }
            rooms.push(roomdetails);
            namemap[socket.id]={roomId,name:hostName};
            io.to(roomId).emit('creator-room-info',hostName,roomId);
            
            return;
        }
        for (i = 0; i <= rooms.length; i++) {
            if (roomId === rooms[i].roomId) {
                socket.emit('room-present');
                return;
            }
            else {
                socket.join(roomId);
                let roomdetails = {
                    roomId: roomId,
                    host: hostName,
                    members: []
                }
                namemap[socket.id]={roomId,name:hostName};
                rooms.push(roomdetails);
                io.to(roomId).emit('creator-room-info',hostName,roomId);
                
                break;
            }

        }

    });

    socket.on('join-room', (roomId, name) => {
        for (i = 0; i < rooms.length; i++) {
            if (roomId === rooms[i].roomId) {
                socket.join(roomId);
                namemap[socket.id]={roomId,name};
                rooms[i].members.push(name);
                io.to(roomId).emit('room-details',name);
                break;
            }
        }
    });


    socket.on('clicked-time',(id,name,clickedtime)=>{
        io.to(id).emit('press-info',name,clickedtime);

    });

    socket.on('reset',(roomid)=>{
        io.to(roomid).emit('reset-leaderboard');
    });


    socket.on('disconnect',()=>{
        const room=namemap[socket.id].roomId;
        const name=namemap[socket.id].name;
        delete namemap[socket.id];
        io.to(room).emit('disconnected',name);
    })

});