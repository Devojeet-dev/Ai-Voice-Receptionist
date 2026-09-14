import { Router } from "express";
import { staffController } from "../controllers/staff.controller";

const router = Router();

router.get("/", staffController.getAll);
router.get("/:id", staffController.getById);
router.post("/", staffController.create);
router.put("/:id", staffController.update);
router.delete("/:id", staffController.remove);

export default router;
