import { Router, Request, Response } from "express";
import MySQL from "../mysql/mysql";
import Server from "../server/server";




const router = Router();
var crypto = require('crypto');

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


router.post('/login', (req: Request, res: Response) => {

    console.log('Server login');
    const username = MySQL.instance.cnn.escape(req.body.username);
    console.log(` Usuario: ${username}`);

    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const escPassword = MySQL.instance.cnn.escape(password);

    console.log(` password: ${password}`);

    const query = ` SELECT u.user_id, a.idacuario, a.description nomacuario, u.nombre 
    FROM usuario u inner join acuario a on a.user_id = u.user_id  
    WHERE username = ${username} and password = ${escPassword} order by 2 asc limit 1
     `;

    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(usuario[0]);
            
            res.json({
                ok: true,
                userData: usuario[0]
            }
            );
        }
    });

});


router.post('/signup', (req: Request, res: Response) => {

    const email = MySQL.instance.cnn.escape(req.body.email);
    const nombre = MySQL.instance.cnn.escape(req.body.nombre);
    const apellido = MySQL.instance.cnn.escape(req.body.apellido);
    const direccion = MySQL.instance.cnn.escape(req.body.direccion);
    const telefono = MySQL.instance.cnn.escape(req.body.telefono);
    const comuna = MySQL.instance.cnn.escape(req.body.comuna);
    const ciudad = MySQL.instance.cnn.escape(req.body.ciudad);
    const username = MySQL.instance.cnn.escape(req.body.username);
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    const escPassword = MySQL.instance.cnn.escape(password);

    const query = ` INSERT INTO usuario (username, password, nombre, apellido, email, direccion, comuna, ciudad, telefono) 
    VALUES ( ${username}, ${escPassword}, ${nombre}, ${apellido}, ${email}, ${direccion}, ${comuna}, ${ciudad}, ${telefono} ) `;

    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                signup: usuario
            });
        }
    });

});

router.post('/editUser', (req: Request, res: Response) => {

    const email = MySQL.instance.cnn.escape(req.body.email);
    const nombre = MySQL.instance.cnn.escape(req.body.nombre);
    const apellido = MySQL.instance.cnn.escape(req.body.apellido);
    const direccion = MySQL.instance.cnn.escape(req.body.direccion);
    const telefono = MySQL.instance.cnn.escape(req.body.telefono);
    const comuna = MySQL.instance.cnn.escape(req.body.comuna);
    const ciudad = MySQL.instance.cnn.escape(req.body.ciudad);
    const username = MySQL.instance.cnn.escape(req.body.username);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` UPDATE usuario 
    set nombre= ${nombre}, apellido=${apellido}, email=${email}, direccion=${direccion}, comuna=${comuna}, ciudad=${ciudad}, telefono=${telefono} 
    where username=${username} `;

    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: usuario
            });
        }
    });

});

router.post('/getUser', (req: Request, res: Response) => {

    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` SELECT  u.username, u.password, u.nombre, u.apellido, u.email, u.telefono, u.direccion, c.id comuna, r.id ciudad 
    FROM usuario u 
    inner join regiones r on u.ciudad = r.id 
    inner join comunas c on u.comuna = c.id  
    where user_id = ${user_id} limit 1  `;

    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: usuario
            });
        }
    });

});

router.get('/getUsers', (req: Request, res: Response) => {

    const query = ` SELECT * FROM usuario `;

    MySQL.ejecutarQuery(query, (err: any, usuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: usuarios
            });
        }
    });
});


router.get('/getAcuarios', (req: Request, res: Response) => {

    const query = ` SELECT * FROM acuario `;

    MySQL.ejecutarQuery(query, (err: any, acuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                acuarios: acuarios
            });
        }
    });
});

router.post('/getAcuariosUser', (req: Request, res: Response) => {

    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` SELECT u.user_id, a.idacuario, a.description nomacuario, u.nombre 
    FROM usuario u 
    inner join acuario a on a.user_id = u.user_id 
    WHERE (a.user_id = ${user_id} )  
    order by 2 asc `;

    MySQL.ejecutarQuery(query, (err: any, acuarios: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: acuarios
            });
        }
    });

});

// Devuelve acuario, creo que falta validar en web nuevamente.
router.post('/getAcuario', (req: Request, res: Response) => {

    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` SELECT * FROM acuario where user_id = ${user_id} order by 1 asc `;

    MySQL.ejecutarQuery(query, (err: any, acuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                acuarioData: acuario
            });
        }
    });

});

router.post('/getAcuarioId', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` SELECT * FROM acuario where idacuario = ${idacuario} order by 1 asc `;

    MySQL.ejecutarQuery(query, (err: any, acuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                acuarioData: acuario
            });
        }
    });

});

// Obtiene las configuraciones del acuario
router.post('/getDetailAcuario', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` select c.description, pp.param, pp.value 
    FROM procParam pp inner join acuario a on pp.acuario_idacuario = a.idacuario 
    inner join category c on c.idcategory = pp.category_idcategory 
    where a.idacuario = ${idacuario} `;

    MySQL.ejecutarQuery(query, (err: any, acuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                acuarioData: acuario
            });
        }
    });

});

//Agrega un nuevo Acuario
router.post('/addAcuario', (req: Request, res: Response) => {

    const user_id = MySQL.instance.cnn.escape(req.body.user_id);
    const account = MySQL.instance.cnn.escape(req.body.account);
    const nombreAcuario = MySQL.instance.cnn.escape(req.body.nombreAcuario);
    const tipoPez = MySQL.instance.cnn.escape(req.body.tipoPez);

    console.log(` user_id: ${user_id} `);

    const query = ` INSERT INTO acuario (description, account_idaccount, user_id, pez) 
    VALUES ( ${nombreAcuario}, ${account}, ${user_id}, ${tipoPez} ) `;

    MySQL.ejecutarQuery(query, (err: any, acuario: Object[]) => {

        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {


            res.json({
                ok: true,
                acuarioData: acuario
            });
        }
    });

});


router.get('/getRegiones', (req: Request, res: Response) => {

    const query = ` SELECT * FROM regiones order by 1 asc `;

    MySQL.ejecutarQuery(query, (err: any, regiones: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                regionesData: regiones
            });
        }
    });
});

router.get('/getComunas/:idregion', (req: Request, res: Response) => {

    const idregion = req.params.idregion;
    const query = ` SELECT * FROM comunas where region_id = ${idregion} order by 2 asc `;

    MySQL.ejecutarQuery(query, (err: any, comunas: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                comunasData: comunas
            });
        }
    });
});

router.post('/getAlimentoList', (req: Request, res: Response) => {


    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` SELECT * FROM alimento where acuario_idacuario =  ${idacuario} `;

    MySQL.ejecutarQuery(query, (err: any, alimento: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                alimentoList: alimento
            });
        }
    });

});

router.post('/searchUser', (req: Request, res: Response) => {

    const username = MySQL.instance.cnn.escape(req.body.username);

    const query = ` SELECT count(*) cantidad FROM usuario where username = ${username}  `;

    MySQL.ejecutarQuery(query, (err: any, usuario: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: usuario
            });
        }
    });

});

router.post('/chart', (req: Request, res: Response) => {

    const category_id = MySQL.instance.cnn.escape(req.body.category_id);
    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    

    //console.log("Buscara datos para chart", category_id, idacuario);
    

    const query = ` Select substring(date_add(dateRegistro, interval -4 hour),1,13) fecha,
    substring(date_add(dateRegistro, interval -4 hour),12,2) hora, 
    min(value) valmin ,max(value) valmax 
   from registro 
   where category_idcategory = ${category_id} and acuario_idacuario = ${idacuario}
   and dateRegistro >= DATE_ADD(now(),interval -24 hour) group by 1,2 order by 1 asc limit 24;  `;

   //console.log(query);
   
    MySQL.ejecutarQuery(query, (err: any, chart: Object[]) => {
        if (err) {            
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            console.log(chart);
            
            res.json({
                ok: true,
                chartData: chart
            });
        }
    });

});

router.post('/chartTempPh', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` (select date_add(r.dateRegistro, interval -4 hour) dateRegistro, r.value, r.state, c.description  
    from registro r inner join category c on r.category_idcategory = c.idcategory
    where r.category_idcategory = 1 and r.acuario_idacuario = ${idacuario} order by r.idregistro desc limit 1) 
    union 
    ( select r.dateRegistro, r.value, r.state, c.description  
        from registro r inner join category c on r.category_idcategory = c.idcategory 
        where r.category_idcategory = 2 and r.acuario_idacuario = ${idacuario} order by r.idregistro desc limit 1) 
    union 
    ( select r.dateRegistro, r.value, r.state, c.description  
        from registro r inner join category c on r.category_idcategory = c.idcategory 
        where r.category_idcategory = 5 and r.acuario_idacuario = ${idacuario} order by r.idregistro desc limit 1) ;  `;

    MySQL.ejecutarQuery(query, (err: any, chart: Object[]) => {
        if (err) {
            console.log("Fallo consulta chartTempPh ", err);
            
            res.json({
                ok: false,
                chartData: [
                    {dateRegistro :"Sin Data", value: "0", state: "red", description:"Temperatura"},
                    {dateRegistro:"Sin Data",value:"0",state:"red",description:"Ph"},
                    {dateRegistro:"Sin Data",value:"NOK",state:"red",description:"Nivel de agua"}
                ]
            });
        } else {
            console.log("Exito en consulta chartTempPh ", chart[0]);
            
            res.json({
                ok: true,
                chartData: chart
            });
        }
    });

});

router.post('/setConfig', (req: Request, res: Response) => {

    const user_id = MySQL.instance.cnn.escape(req.body.user_id);
    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);
    const tempmin = MySQL.instance.cnn.escape(req.body.tempmin);
    const tempmax = MySQL.instance.cnn.escape(req.body.tempmax);
    const phmin = MySQL.instance.cnn.escape(req.body.phmin);
    const phmax = MySQL.instance.cnn.escape(req.body.phmax);
    const filtromin = MySQL.instance.cnn.escape(req.body.filtromin);
    const filtromax = MySQL.instance.cnn.escape(req.body.filtromax);
    const airemin = MySQL.instance.cnn.escape(req.body.airemin);
    const airemax = MySQL.instance.cnn.escape(req.body.airemax);
    const luzdiamin = MySQL.instance.cnn.escape(req.body.luzdiamin);
    const luzdiamax = MySQL.instance.cnn.escape(req.body.luzdiamax);
    const luznochemin = MySQL.instance.cnn.escape(req.body.luznochemin);
    const luznochemax = MySQL.instance.cnn.escape(req.body.luznochemax);
    const nivelagua = MySQL.instance.cnn.escape(req.body.nivelagua);

    const query = `
    update procParam p set p.value = ${tempmin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "tempmin";
    update procParam p set p.value = ${tempmax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "tempmax";
    update procParam p set p.value = ${phmin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "phmin";
    update procParam p set p.value = ${phmax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "phmax";
    update procParam p set p.value = ${luzdiamin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "luzdiamin";
    update procParam p set p.value = ${luzdiamax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "luzdiamax";
    update procParam p set p.value = ${luznochemin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "luznochemin";
    update procParam p set p.value = ${luznochemax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "luznochemax";
    update procParam p set p.value = ${nivelagua} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "nivelagua";
    update procParam p set p.value = ${filtromin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "filtromin";
    update procParam p set p.value = ${filtromax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "filtromax";
    update procParam p set p.value = ${airemin} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "airemin";
    update procParam p set p.value = ${airemax} , p.cambio_estado="Y" where acuario_idacuario = ${idacuario} and acuario_account_idaccount = ${user_id} and param = "airemax"; `;

    MySQL.ejecutarQuery(query, (err: any, procParam: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: procParam
            });
        }
    });

});


router.post('/getConfig', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` select c.description, pp.param, pp.value 
    FROM procParam pp inner join acuario a on pp.acuario_idacuario = a.idacuario 
    inner join category c on c.idcategory = pp.category_idcategory 
    where a.idacuario = ${idacuario}; `;

    MySQL.ejecutarQuery(query, (err: any, config: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                configData: config
            });
        }
    });

});

router.post('/getState', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` select a.description, aa.state, aa.mode  
    from artefact_has_acuario aa 
    inner join artefact a on a.idartefact = aa.artefact_idartefact 
    where acuario_idacuario =  ${idacuario}; `;

    MySQL.ejecutarQuery(query, (err: any, state: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                stateData: state
            });
        }
    });

});

router.post('/setState', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);
    const art = MySQL.instance.cnn.escape(req.body.art);
    const nvalue = MySQL.instance.cnn.escape(req.body.nvalue);


    const query = ` update artefact_has_acuario 
    set state = ${nvalue} , mode ="MANUAL" 
    where acuario_idacuario = ${idacuario} and artefact_idartefact = ${art} ;  `;

    MySQL.ejecutarQuery(query, (err: any, state: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                stateData: state
            });
        }
    });

});

router.post('/addAlimento', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` insert into alimento (acuario_idacuario, hora, porcion) 
    VALUES ( ${idacuario}, "00:00", "1"); 
    SELECT * from alimento where  acuario_idacuario = ${idacuario};  `;

    MySQL.ejecutarQuery(query, (err: any, alimento: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {

           
            const server = Server.instance;
            console.log('emitiendo desde el server add-alimento para id: ', user_id, alimento[1]);

            server.io.emit('alimentoList', 'se ha agregado un nuevo alimento');

            res.json({
                ok: true,
                alimentoList: alimento[1]
            });
        }
    });

});

router.post('/deleteAlimento', (req: Request, res: Response) => {

    const idalimento = MySQL.instance.cnn.escape(req.body.idalimento);
    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` delete from alimento 
    where acuario_idacuario = ${idacuario} and idalimento = ${idalimento} ; 
    SELECT * from alimento where  acuario_idacuario = ${idacuario}; `;

    console.log(query);


    MySQL.ejecutarQuery(query, (err: any, alimento: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            const server = Server.instance;
            console.log('emitiendo desde el server alimentoList para id: ', user_id, alimento[1]);

            server.io.emit('alimentoList', 'se ha eliminado un alimento');

            res.json({
                ok: true,
                alimentoList: alimento[1]
            });
        }
    });

});

router.post('/setStateAlimento', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);
    const idalimento = MySQL.instance.cnn.escape(req.body.idalimento);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);
    var nvalue = MySQL.instance.cnn.escape(req.body.nvalue);

    if (nvalue)
        nvalue = "true";
    else
        nvalue = "false";

    const query = ` update alimento set habilitado = ${nvalue}  
    where acuario_idacuario = ${idacuario} 
    and idalimento = ${idalimento}; `;

    MySQL.ejecutarQuery(query, (err: any, state: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                stateAlimento: state
            });
        }
    });

});

router.post('/editAlimento', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.acuario_idacuario);
    const idalimento = MySQL.instance.cnn.escape(req.body.idalimento);
    const hora = MySQL.instance.cnn.escape(req.body.hora);
    const porcion = MySQL.instance.cnn.escape(req.body.porcion);
    const habilitado = MySQL.instance.cnn.escape(req.body.habilitado);


    const query = ` update alimento 
    set hora = ${hora}, porcion = ${porcion} 
    where idalimento = ${idalimento} and acuario_idacuario = ${idacuario} `;

    MySQL.ejecutarQuery(query, (err: any, procParam: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                userData: procParam
            });
        }
    });

});

router.post('/setMode', (req: Request, res: Response) => {

    const idacuario = MySQL.instance.cnn.escape(req.body.idacuario);

    const query = ` update artefact_has_acuario 
    set mode = "AUTO" 
    where acuario_idacuario = ${idacuario}; `;

    MySQL.ejecutarQuery(query, (err: any, state: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                stateMode: state
            });
        }
    });

});

router.post('/setTokenPush', (req: Request, res: Response) => {

    const tokenPush = MySQL.instance.cnn.escape(req.body.tokenPush);
    const user_id = MySQL.instance.cnn.escape(req.body.user_id);

    const query = ` update usuario  
    set tokenPush = ${tokenPush} 
    where user_id = ${user_id}; `;

    MySQL.ejecutarQuery(query, (err: any, token: Object[]) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.json({
                ok: true,
                tokenData: token
            });
        }
    });

});

export default router;