import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller";

const router = Router();

router.get("/", appointmentController.getAll);
router.get("/staff/:staffId", appointmentController.getByStaff);
router.get("/customer/:customerId", appointmentController.getByCustomer);
router.get("/business/:businessId", appointmentController.getByBusiness);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.remove);

export default router;
