import { Router } from "express";
import { conversationController } from "../controllers/conversation.controller";

const router = Router();

router.get("/", conversationController.getAll);
router.get("/customer/:customerId", conversationController.getByCustomer);
router.get("/business/:businessId", conversationController.getByBusiness);
router.get("/:id", conversationController.getById);
router.post("/", conversationController.create);
router.put("/:id", conversationController.update);
router.delete("/:id", conversationController.remove);

export default router;
