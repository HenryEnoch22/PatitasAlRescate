import Report from "../models/ReportModel.js";
import User from "../models/UserModel.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export const createReport = async (req, res) => {
	const errors = validationResult(req);
	const { id: userId } = req.user;

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const {
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
			userId,
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
