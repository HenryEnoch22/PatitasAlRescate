import { setRandomFallback } from "bcryptjs";
import Comment from "../models/CommentModel.js";
import { validationResult } from 'express-validator';
import mongoose from "mongoose";

export const getCommentsByReportId = async (req, res) => {
    const reportId = req.params.reportId; //Recibe como parametro el id del reporte para obtener los comentarios
    try{
        if(!mongoose.Types.ObjectId.isValid(reportId)){
            return res.status(400).json({ 
                status: "error",
                message: "El id del reporte no es válido" 
            });
        }
        const comments = await Comment.find({reportId});
        if(!comments){
            return res.status(404).json({ 
                status: "error",
                message: "No se encontraron comentarios para este reporte" 
            });
        }
        
        return res.status(200).json({
            status: "success",
            message: "Comentarios obtenidos correctamente",
            data: comments,
        });
    }catch(error){
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}


export const createComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id; 
    const {reportId, text } = req.body;

    try {
        const newComment = await Comment.create({userId, reportId, text});
    
        return res.status(201).json({
            status: "success",
            message: "Comentario creado correctamente",
            data: newComment,
        });

    } catch (error) {
        return res
        .status(500)
        .json({ message: "Error en el servidor", error: error.message });
    }
}


export const updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const  text  = req.body.text; 

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(400).json({ 
            status: "error",
            message: "El id del comentario no es válido" 
        });
    }
    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            return res.status(404).json({ status: "error",message: "No se encontró el comentario"});
        }
        if(comment.userId.toString() !== req.user.id){  //Validación para que el usuario que creó el comentario sea el único que lo pueda editar
            return res.status(403).json({ status: "error",message: "No tienes permiso para editar este comentario"});
        }

      
        comment.text = text; //Actualiza el texto del comentario
        await comment.save(); //Guarda los cambios en la base de datos

        return res.status(200).json({
            status: "success",
            message: "Comentario actualizado correctamente",
            data: comment,
        });

    }catch(error){
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
    
}


export const deleteComment = async (req, res) => {
    const commentId = req.params.commentId; //Recibe como parametro el id del comentario a eliminar
    try{
        if(!mongoose.Types.ObjectId.isValid(commentId)){
            return res.status(400).json({ 
                status: "error",
                message: "El id del comentario no es válido" 
            });
        }
        const comment = await Comment.findByIdAndDelete(commentId);
        if(!comment){
            return res.status(404).json({ 
                status: "error",
                message: "No se encontró el comentario" 
            });
        }
        
        return res.status(200).json({
            status: "success",
            message: "Comentario eliminado correctamente",
        });
    }catch(error){
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}