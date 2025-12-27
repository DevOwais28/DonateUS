import express from "express"
import { createReceipt, getAllReceipts , getReceiptById } from "../controllers/receipt.js";

const router = express.Router();

router.post("/receipt", createReceipt);
router.get("/receipt", getAllReceipts);
router.get("/receipt/:id", getReceiptById);

export default router;