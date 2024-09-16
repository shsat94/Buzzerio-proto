
const port=process.env.PORT ||8000;


const io = require('socket.io')(port, { cors: { origin: "*" } });
let rooms = [];

let namemap = {};


const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}


try {
    io.on('connection', socket => {
        namemap[socket.id] = {};
        const roomId = generateRoomId();
        socket.on('create-room', (hostName) => {
            if (rooms.length ===0) {

                socket.join(roomId);
                let roomdetails = {
                    roomId: roomId,
                    host: hostName,
                    members: []
                }
                rooms.push(roomdetails);
                namemap[socket.id] = { roomId, name: hostName };
                io.to(roomId).emit('creator-room-info', hostName, roomId);

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
                    namemap[socket.id] = { roomId, name: hostName };
                    rooms.push(roomdetails);
                    io.to(roomId).emit('creator-room-info', hostName, roomId);

                    break;
                }

            }

        });

        socket.on('join-room', (roomId, name) => {
            let roomidispresent=false
            for (i = 0; i < rooms.length; i++) {
                if (roomId === rooms[i].roomId) {
                    socket.join(roomId);
                    namemap[socket.id] = { roomId, name };
                    rooms[i].members.push(name);
                    roomidispresent=true;
                    
                    break;
                }
            }

            !roomidispresent?socket.emit('invalid-room'):io.to(roomId).emit('room-details', name);;
        });


        socket.on('clicked-time', (id, name, clickedtime) => {
            io.to(id).emit('press-info', name, clickedtime);

        });

        socket.on('reset', (roomid) => {
            io.to(roomid).emit('reset-leaderboard');
        });

        socket.on('closeRoom',(roomid)=>{
            for (i = 0; i < rooms.length; i++) {
                if (roomid === rooms[i].roomId) {
                    rooms.splice(i, i+1);
                    io.to(roomid).emit('resetwindow');
                    break;
                }
            }
        })


        socket.on('close-mem-room', () => {
            const room = namemap[socket.id].roomId;
            const name = namemap[socket.id].name;
            delete namemap[socket.id];
            for (i = 0; i < rooms.length; i++) {
                if (rooms[i].roomId === room) {
                    for(j=0;j<rooms[i].members.length;j++){
                        if(name===rooms[i].members[j]){
                            rooms[i].members.splice(j,j+1);
                            io.to(room).emit('disconnected', name);
                            break;
                        }
                    }
                    
                    
                }
            }
            
        });


    });

} catch (error) {
}
