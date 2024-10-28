import jwt from "passport-jwt";
import passport from "passport";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
        //Misma palabra secreta que tenemos en App.js
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
            //   // Asegúrate de que el payload contenga el ID del usuario
            //   return done(null, { id: jwt_payload.id, email: jwt_payload.email })
        } catch (error) {
            return done(error);
        }
    }))

    

}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}


export default initializePassport;
