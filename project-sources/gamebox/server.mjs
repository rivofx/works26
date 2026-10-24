import next from 'next';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { RoomEngine } from './src/server/room-engine.mjs';

const dev=process.argv.includes('--dev');
process.env.NODE_ENV=dev?'development':'production';
const app=next({dev});
const port=Number(process.env.PORT||3000);
await app.prepare();
const handler=app.getRequestHandler();
const http=createServer((req,res)=>handler(req,res));
const wss=new WebSocketServer({noServer:true,maxPayload:65536});
const rooms=new RoomEngine();
http.on('upgrade',(req,socket,head)=>{
  if(new URL(req.url||'/',`http://${req.headers.host}`).pathname!=='/ws'){socket.destroy();return}
  if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){socket.destroy();return}
  wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));
});
wss.on('connection',ws=>rooms.connect(ws));
http.listen(port,()=>console.log(`GameBox ready at http://localhost:${port}`));
