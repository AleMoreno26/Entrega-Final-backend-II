import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/user.models.js"
import { createHash, isValidPassword } from "../utils/util.js"
import passport from "passport";
import jwt from "jsonwebtoken";
import ProductModel from "../dao/models/product.models.js";

//Registro: 

router.post("/register", async (req, res) => {
    let { first_name, last_name, email, password, age } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        // Crear un nuevo usuario con los campos correctos
        const nuevoUsuario = new UserModel({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        });

        await nuevoUsuario.save();

        // Generar el token JWT
const token = jwt.sign(
    {
        id: nuevoUsuario._id, 
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
    },
    "coderhouse",  // Clave secreta
    { expiresIn: '1h' }  // Expiración
);

        // Crear la cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        });

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

//Login
router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
        // Buscar el usuario en MongoDB
        const usuarioEncontrado = await UserModel.findOne({ email });

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no identificado");
        }

        // Verificamos la contraseña
        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta!");
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuarioEncontrado._id,
                first_name: usuarioEncontrado.first_name,
                last_name: usuarioEncontrado.last_name,
                email: usuarioEncontrado.email,
                rol: usuarioEncontrado.rol
            },
            "coderhouse",
            { expiresIn: "1h" }
        );

        // Crear la cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        });

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/current", passport.authenticate("current", { session: false }), async (req, res) => {
    try {
        // Obtener los productos
        const productos = await ProductModel.find();

        res.render("home", { user: req.user, productos });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos.");
    }
});

//Logout: 

router.post("/logout", (req, res) => {
    
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

//Ruta Admin: 

router.get("/admin", passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado");
    }

    //Ruta usuario admin
    res.render("admin");
})

export default router; 