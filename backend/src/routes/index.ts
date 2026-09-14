import { Router } from "express";
import businessRoutes from "./business.routes";
import staffRoutes from "./staff.routes";
import serviceRoutes from "./service.routes";
import customerRoutes from "./customer.routes";
import appointmentRoutes from "./appointment.routes";
import availabilityRoutes from "./availability.routes";
import conversationRoutes from "./conversation.routes";

const router = Router();

router.use("/businesses", businessRoutes);
router.use("/staff", staffRoutes);
router.use("/services", serviceRoutes);
router.use("/customers", customerRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/availability", availabilityRoutes);
router.use("/conversations", conversationRoutes);

export default router;
