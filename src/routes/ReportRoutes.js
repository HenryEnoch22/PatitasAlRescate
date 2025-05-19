import { Router } from "express";
import {
  createReport,
  updateReport, 
  getAllReports,
  getReportByQuery,
  getReportById,
  finishReport,
} from "../controllers/ReportController.js";
import CreateValidator from "../validators/report/CreateValidator.js";
import UpdateValidator from "../validators/report/UpdateValidator.js";


const router = Router();

router.post("/create", CreateValidator, createReport);
router.get("/getAllReports", getAllReports);
router.post("/finishReport", finishReport);
router.get("/getReportById/:id", getReportById);
router.get("/getReportByQuery/:param", getReportByQuery);
router.put("/update/:id", UpdateValidator, updateReport);
export default router;
