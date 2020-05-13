
import express = require ('express');
import path = require('path');

import socketIO from 'socket.io';
import  http from "http";

import * as socket from "../sockets/socket";


export default class Server{

    private static _instance: Server;
    public app: express.Application;
    public port: number; 

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor (){
        this.port = 3000;
        this.app = express();
        
        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    private escucharSockets (){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente =>{
            
            console.log('Cliente Conectado');
            
            // Conectar Cliente
            console.log(cliente.id);
            
           // socket.conectarCliente(cliente, this.io);

           
            //Configurar Usuario
            socket.login(cliente, this.io);
            //socket.obtenerUsuarios(cliente, this.io);

            //Mensajes 
            
            socket.mensaje(cliente, this.io);
            socket.addAlimento(cliente, this.io);

            // Desconectar
            socket.desconectar(cliente, this.io);
  
        });       
    }

    public static get instance(){

        return this._instance || ( this._instance = new this() );

    }

    /*static init (puerto: number){
        return new Server( puerto );
    }*/

    private publicFolder(){
        const publicPath = path.resolve(__dirname,'../public');
        this.app.use(express.static( publicPath));
    }


    start( callback: Function){

        //this.app.listen(this.port, callback);
        this.httpServer.listen(this.port, callback);

        this.publicFolder();
    }
}
