import User from '../models/UserModel.js';
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({ message: "El correo ingresado ya está en uso." });
        }

        const hasgedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hasgedPassword});

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(201).json({
            message: "Usuario creado correctamente",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    
    }catch(error){
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }

}

export const login = async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });    
    }

    const {email, password } = req.body;

    try{
        const userRegistered = await User.findOne({email});
        const isPasswordValid = await bcrypt.compare(password, userRegistered.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign({id: userRegistered._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: "Usuario logueado corectamente",
            token,
            user: {
                id: userRegistered._id,
                name: userRegistered.name,
                email: userRegistered.email,
            }
        });
        
    }catch(error){
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

//This method is not functional, only return message to the cliente (cliente removes token in the frontend)
export const logout = async (_req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}


