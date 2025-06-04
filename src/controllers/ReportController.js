import Report from "../models/ReportModel.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import fs from "fs";

export const createReport = async (req, res) => {
  const errors = validationResult(req);
  const userId = req.user.id;

  if (!errors.isEmpty()) {
    console.log("Borrando imagen por error de validación:", req.file?.path);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  if (!userId) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { petName, userContact, lastSeenLocation, description } = req.body;

  let petDetails;
  try {
    petDetails = JSON.parse(req.body.petDetails);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(400)
      .json({ message: "Formato inválido en petDetails", error: err.message });
  }

  try {
    const reportExists = await Report.findOne({
      petName,
      lastSeenLocation,
      "petDetails.breed": petDetails.breed,
      "petDetails.species": petDetails.species,
      "petDetails.color": petDetails.color,
    });

    if (reportExists) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "El reporte ya existe." });
    }

    console.log("Archivo que se va a guardar:", req.file);

    const newReport = new Report({
      userId,
      petName,
      petDetails,
      userContact,
      lastSeenLocation,
      description,
      photo: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });

    await newReport.save();

    return res.status(201).json({
      message: "Reporte creado correctamente",
      newReport,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json({
      status: "success",
      message: "Reportes obtenidos correctamente",
      length: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const getReportByQuery = async (req, res) => {
  let { petDetails } = req.query;

  try {
    if (typeof petDetails === "string") {
      try {
        petDetails = JSON.parse(petDetails);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "petDetails debe ser un JSON válido" });
      }
    }

    const query = {};

    for (const field of ["breed", "species", "color"]) {
      if (petDetails[field]) {
        query[`petDetails.${field}`] = petDetails[field];
      }
    }

    const report = await Report.findOne(query);

    if (!report) {
      return res.status(404).json({
        message: "No se encontraron reportes",
      });
    }

    return res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    return res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateReport = async (req, res) => {
  const { id } = req.params;

  // Parsear petDetails si viene como string en form-data
  if (req.body.petDetails && typeof req.body.petDetails === "string") {
    try {
      req.body.petDetails = JSON.parse(req.body.petDetails);
    } catch (err) {
      return res.status(400).json({
        message: "Formato inválido en petDetails",
        error: err.message,
      });
    }
  }

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReport) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    return res.status(200).json({
      message: "Reporte actualizado correctamente",
      report: updatedReport,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar el reporte", error });
  }
};

export const finishReport = async (req, res) => {
  const { reportId } = req.body;
  const { id: userId } = req.user;

  try {
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    if (!report.userId.equals(userId)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para finalizar este reporte" });
    }

    if (report.status === "finished") {
      return res.status(400).json({ message: "El reporte ya está finalizado" });
    }

    report.status = "finished";
    await report.save();

    return res.status(200).json({
      status: "success",
      message: "Reporte finalizado correctamente",
      data: report,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const reportAsfake = async (req, res) => {
  const { reportId } = req.params;
  const { id: userId } = req.user;
  const { reason } = req.body;

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    const existingReport = await Report.findOne({
      _id: reportId,
      "fakeReports.reportedBy": userId,
    });

    if (existingReport) {
      return res.status(400).json({ message: "Ya has reportado este caso" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        $push: { fakeReports: { reportedBy: userId, reason } },
      },
      { new: true }
    );

    if (updatedReport.fakeReports.length >= 10) {
      updatedReport.status = "fake";
      await updatedReport.save();
    }

    res.status(200).json({
      status: "success",
      message: "Reporte falso registrado",
      data: updatedReport,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
