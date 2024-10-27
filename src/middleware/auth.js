import { json } from "express";
import passport from "passport";

export const isAuthenticated = (req, res, next) => {
    passport.authenticate('session', (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user; // Almacena el usuario en la solicitud
        next(); // Continua a la siguiente función o ruta
    })(req, res, next);
};
//Hacemos una funcion verifica que seas admin: 

export function soloAdmin(req, res, next) {
    if(req.user.role === "admin") {
        next(); 
    }else{
        res.status(403).send("Acceso denegado,solo para administrad"); 
    }
}

//Hfuncion que verifique que seas user: 

export function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next(); 
    }else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios"); 
    }
}

