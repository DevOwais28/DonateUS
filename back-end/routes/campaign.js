import express from "express"
import { createCampaign, getAllCampaigns, getCampaignById ,updateCampaign,deleteCampaign} from "../controllers/campaign.js";
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authentication.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: "Campaign routes are working!", timestamp: new Date() });
});

router.post("/campaign", authenticate, upload.single('image'), createCampaign);
router.get("/", getAllCampaigns);
router.get("/campaign/:id", getCampaignById);
router.put("/campaign/:id", authenticate, updateCampaign);
router.delete("/campaign/:id", authenticate, deleteCampaign)

export default router;
