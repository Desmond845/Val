import express from "express";
const router = express.Router();
import {
  getFriends,
  getFriend,
  sendFile,
  getDevStats,
  trackView,
  sendDevDashboard,
  mailer,
  contactLimiter,
} from "../controllers/routesController.js";
router.post("/api/friends/:friendName/view", trackView); // Track views
router.get("/api/dev/stats", getDevStats);
router.post("/api/friends/:id", trackView);
router.get("/friends", getFriends);
router.get("/friends/:id", sendFile);
router.get("/api/friends/:id", getFriend);
router.get("/", sendFile);
router.get("/dev/hide", sendDevDashboard);
router.post("/api/contact", contactLimiter, mailer);
export default router;
