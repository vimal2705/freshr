import io from 'socket.io-client';
const SOCKET_URL ='https://secret-caverns-70396-e6c5c94cfdfb.herokuapp.com'
// const SOCKET_URL='https://a93d-2405-201-201c-8115-ac40-db93-5f78-1dbb.ngrok-free.app'
// const SOCKET_URL = 'https://637b-2405-201-201c-8115-d093-e02b-6909-3587.ngrok-free.app'
class WSService {
    initializeSocket=async()=>{
        try {
            this.socket=io(SOCKET_URL,{
                transports:['websocket']
            })
            console.log("initializing socket",this.socket);
            this.socket.on("connect",(data)=>{
                console.log("===connecteddd");
            })
            this.socket.on("disconnect",(data)=>{
                console.log("===disconnecteddd");
            })
            this.socket.on("error",(data)=>{
                console.log("===error",data);
            })
        } catch (error) {
            console.log("not initialised");
        }
    }
    emit(event,data={}){
        this.socket.emit(event,data)
    }
    on(event,cb){
        this.socket.on(event,cb)
    }
    removeListener(listenerName){
        this.socket.removeListener(listenerName)
    }
}
const socketServices=new WSService()
export default socketServices;