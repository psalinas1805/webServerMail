import { Socket } from "socket.io";
import socketIO from 'socket.io';
import MySQL from "../mysql/mysql";

var crypto = require('crypto');

//import { UsuariosLista } from "../classes/usuarios-lista";
//import { Usuario } from "../classes/usuario";

//export const UsuariosConectados = new UsuariosLista();



export const desconectar = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('disconnect', () => {
        console.log('Usuario desconectado');

        //io.emit('usuarios-activos', UsuariosConectados.getLista());

    });
}

// Escuchar login usuario

export const login = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('login', (payload: { username: string, password: string }, callback: Function) => {
        /*        console.log("entra login", payload);
                callback({
                    ok: true,
                    mensaje: `Usuario ${payload.username} configurado`
                });
        //        io.emit('Login Usuario', payload);*/

        console.log('Server login');
        const username = MySQL.instance.cnn.escape(payload.username);
        console.log(` Usuario: ${username}`);

        const password = crypto.createHash('sha256').update(payload.password).digest('hex');
        const escPassword = MySQL.instance.cnn.escape(password);

        console.log(` password: ${password}`);
   

        const query = `    
            SELECT u.user_id, a.idacuario, a.description nomacuario, u.nombre 
            FROM usuario u inner join acuario a on a.user_id = u.user_id  
            WHERE username = ${username} and password = ${escPassword} order by 2 asc limit 1
     `;

        MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {

            if (usuario) {
                const query = ` update usuario 
                set idsocket = '${cliente.id}' 
                where user_id = ${usuario[0].user_id}; `;


                MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => { });

                callback({
                    userData: usuario[0]
                });
            }

            else {
                console.log(`Error en credenciales para ${cliente.id}`);

                callback({
                    ok: false
                });
            }
        });

    });
}

export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);


    });


}

export const addAlimento = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('addAlimento', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido', payload);

        //io.emit('mensaje-nuevo', payload);
    });
}
/*
// Configurar un usuario
export const configurarUsuario = (cliente:Socket, io: SocketIO.Server) =>{
    cliente.on('configurar-usuario',(payload: { nombre:string}, callback: Function)=>{
    UsuariosConectados.actualizarNombre(cliente.id, payload.nombre);
    io.emit('usuarios-activos', UsuariosConectados.getLista());

        callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre} configurado`
        });
//        io.emit('Login Usuario', payload);
    });
}

export const obtenerUsuarios = (cliente:Socket, io: SocketIO.Server) =>{
    cliente.on('obtener-usuarios',()=>{
        io.to(cliente.id).emit('usuarios-activos', UsuariosConectados.getLista());

    });
}*/