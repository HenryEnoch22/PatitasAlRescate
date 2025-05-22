import { Router } from "express";
import { verifyToken } from '../utils/VerifyToken.js';
import {
  createReport,
  updateReport, 
  getAllReports,
  getReportByQuery,
  getReportById,
  finishReport,
  reportAsfake,
} from "../controllers/ReportController.js";
import CreateValidator from "../validators/report/CreateValidator.js";
import ReportValidator from "../validators/report/ReportValidator.js";
import FinishValidator from "../validators/report/FinishValidator.js";
import UpdateValidator from "../validators/report/UpdateValidator.js";
import upload from "../utils/Upload.js";

const router = Router();

router.post("/create", verifyToken, upload.single("photo"), CreateValidator, createReport);
router.get("/getAllReports", getAllReports);
router.patch("/finishReport", verifyToken,  FinishValidator, finishReport);
router.get("/getReportById/:id", getReportById);
router.get("/getReportByQuery/:param", getReportByQuery);
router.post("/reportAsfake/:reportId", verifyToken, ReportValidator, reportAsfake);
router.patch("/updateReport/:id", verifyToken, upload.single("photo"),UpdateValidator, updateReport);
export default router;
