const io = require('socket.io')(8000, { cors: { origin: "*" } });
let rooms = [];

io.on('connection', socket => {
    socket.on('create-room', (roomId, hostName) => {
        if (rooms.length < 1) {
            socket.join(roomId);
            let roomdetails = {
                roomId: roomId,
                host: hostName,
                members: []
            }
            rooms.push(roomdetails);
            console.log(roomdetails);
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
                console.log(roomdetails);
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
                break;
            }
        }

    });

});