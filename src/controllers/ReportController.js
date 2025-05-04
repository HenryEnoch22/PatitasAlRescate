import Report from "../models/ReportModel.js";
import { validationResult } from "express-validator";

export const createReport = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userEmail,
    petName,
    petDetails,
    userContact,
    lastSeenLocation,
    description,
    photo,
  } = req.body;

  try {
    const reportExists = await Report.findOne({
      petName,
      lastSeenLocation,
      "petDetails.breed": petDetails.breed,
      "petDetails.species": petDetails.species,
      "petDetails.color": petDetails.color,
    });

    if (reportExists) {
      return res.status(400).json({ message: "El reporte ya existe." });
    }

    const newReport = new Report({
      userEmail,
      petName,
      petDetails,
      userContact,
      lastSeenLocation,
      description,
      photo,
    });

    await newReport.save();

    return res.status(201).json({
      message: "Reporte creado correctamente",
      report: {
        userId: newReport.userId,
        petName: newReport.petName,
        petDetails: newReport.petDetails,
        userContact: newReport.userContact,
        lastSeenLocation: newReport.lastSeenLocation,
        description: newReport.description,
        photo: newReport.photo,
      },
    });
  } catch (error) {
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
  const { petName, lastSeenLocation, petDetails = {} } = req.query;
  // In case petDetails isn't define we set it to an empty object
  const queryFields = {
    petName,
    lastSeenLocation,
  };

  const petFields = {
    breed: petDetails.breed,
    species: petDetails.species,
    color: petDetails.color,
  };

  try {
    const query = {};

    // Check queryFields fields
    for (const field in queryFields) {
      if (queryFields[field]) {
        query[field] = queryFields[field];
      }
    }

    // Check petDetails fields
    for (const field in petFields) {
      if (petFields[field]) {
        query[`petDetails.${field}`] = petFields[field];
      }
    }

    const reports = await Report.findOne(query);

    if (reports.length === 0) {
      return res.status(404).json({ message: "No se encontraron reportes" });
    }

    return res.status(200).json({
      status: "success",
      results: reports.length,
      data: reports,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
