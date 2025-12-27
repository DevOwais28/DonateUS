import express from "express"
import { createDonation , getAllDonations , getDonationById , updateDonation , deleteDonation, getMyDonations} from "../controllers/donation.js";
import authenticate from "../middlewares/authentication.js";
const router = express.Router();

router.post("/donation", authenticate, createDonation);
router.get("/donation", authenticate, getAllDonations);
router.get("/donation/:id", authenticate, getDonationById);
router.get("/my-donations", authenticate, getMyDonations);
router.put("/donation/:id", authenticate, updateDonation);
router.delete("/donation/:id", authenticate, deleteDonation);

export default router;