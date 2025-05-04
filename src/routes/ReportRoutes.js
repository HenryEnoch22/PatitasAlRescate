import { Router } from "express";
import {
  createReport,
  getAllReports,
  getReportByQuery,
} from "../controllers/ReportController.js";
import CreateValidator from "../validators/report/CreateValidator.js";

const router = Router();

router.post("/create", CreateValidator, createReport);
router.get("/getAllReports", getAllReports);
router.get("/getReportByQuery/:param", getReportByQuery);
export default router;
