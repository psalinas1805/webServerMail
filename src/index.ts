

import Server from './server/server';
import router from './router/router';
import bodyParse from 'body-parser';
import  cors from 'cors';

const server = Server.instance;
//const server = Server.init(3000);

server.app.use(bodyParse.urlencoded({extended: true}) );
server.app.use(bodyParse.json() );

//CORS
server.app.use(cors({origin: true, credentials: true }) );



server.app.use(router);

//MySQL.instance;


server.start( ()=>{
    console.log("Servidor corriendo en el puerto 3000");
});
