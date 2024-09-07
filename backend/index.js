const io = require('socket.io')(8000, { cors: { origin: "*" } });
let rooms = [];




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
            console.log(rooms);
            
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
                rooms.push(roomdetails);
                console.log(rooms);
                
                break;
            }

        }

    });

    socket.on('join-room', (roomId, name) => {
        for (i = 0; i < rooms.length; i++) {
            if (roomId === rooms[i].roomId) {
                socket.join(roomId);
                rooms[i].members.push(name);
                console.log(rooms);
                console.log(`${name} joined RoomID ${roomId}`);
                io.to(roomId).emit('room-details',name);
                break;
            }
        }
    });

});