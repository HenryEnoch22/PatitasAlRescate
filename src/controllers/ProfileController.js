import User from '../models/UserModel.js';
import { validationResult } from 'express-validator';

export const getUserProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "No se ha proporcionado un ID de usuario"});
        }
        const autenticatedUser = await User.findById(userId).select("-password -__v -createdAt -updatedAt");
        if(!autenticatedUser){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        return res.status(200).json(autenticatedUser);
    }catch (error) {
        return res.status(500).json({message: "Error al obtener el perfil", error: error.message});   
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const userId = req.user.id;
        if (!userId) {
          return res.status(400).json({ message: "No se ha proporcionado un ID de usuario" });
        }
    
        // Datos del cuerpo de la petición
        const { name, birthdate, phone } = req.body;
        const updateData = {};
    
        if (name) updateData.name = name;
        if (birthdate) updateData.birthdate = birthdate;
        if (phone) updateData.phone = phone;
    
        // Foto si se subió
        if (req.file) {
          updateData.profilePhoto = req.file.path;
        }
    
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
          new: true,
        }).select("-password -__v -createdAt -updatedAt");
    
        if (!updatedUser) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
    
        return res.status(200).json({
          message: "Perfil actualizado correctamente",
          user: updatedUser,
        });
    
      } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
      }
}
