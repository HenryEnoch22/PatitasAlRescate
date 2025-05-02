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
            return res.status(400).json({ message: "El usuario ya existe" });
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

