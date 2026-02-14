import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

import connectDB from "../db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Friend } from "../models/migrate.js";
const publicPath = path.join(__dirname, "..", "public")
import dotenv from "dotenv";
dotenv.config();


const loadData = async (req, res, next) => {
  await connectDB();

  const friends = await Friend.find();
  return friends;
};

// Global tracking variables
const DEV_PASSWORD = process.env.DEV_PASSWORD; // Simple password for dev panel
export const getFriends = async (req, res, next) => {
  const password = req.query.password;
  if (password !== DEV_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  } else {
    try {
      const friends = await loadData();

      res.status(200).json(friends);
    } catch (error) {
      next(error);
    }
  }
};

export const getFriend = async (req, res, next) => {
  const password = req.query.password;
  if (password !== DEV_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  } else {
    try {
const id = req.params.id;

      const friend = await Friend.findOne({ id: id });
      if (friend) {
        res.status(200).json(friend);
      } else {
        // Return 404 with helpful message
        res.status(404).json({
          error: "Friend not found",
          message: `No message found for "${req.params.friendName}"`,
          suggestion: "Check the spelling or contact Desmond",
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

export const sendFile = async (req, res, next) => {
  res.sendFile(path.join(publicPath, "/index.html"));
};
export const sendDev = async (req, res, next) => {
    return res.sendFile(path.join(publicPath, "/dev-dashboard.html"));

};
export const sendDevDashboard = async (req, res, next) => {
  const password = req.query.password;
  if (password === DEV_PASSWORD) {
    return res.sendFile(path.join(publicPath, "/dev-dashboard.html"));
  } else {
    res.sendFile(path.join(publicPath, "/404.html"));
  }
};

export const trackView = async (req, res, next) => {
  const password = req.query.password;
  if (password !== DEV_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  } else {
    try {
      const id = req.params.id;
      const friend = await Friend.findOne({ id: id });
      if (!friend) {
        return res.status(404).json({ error: "Invalid link" });
      }
      // Update view stats
      friend.viewCount += 1;
      friend.lastViewed = new Date();
      if (!friend.viewed) {
        friend.viewed = true;
      }
      if (!friend.firstViewed) {
        friend.firstViewed = new Date();
      }

      await friend.save();

      res.status(200).json({
        success: true,
        viewCount: friend.viewCount,
      });
    } catch (error) {
      next(error);
    }
  }
};
// Get dev stats

// ========================
// DEV DASHBOARD FUNCTIONS
// ========================

// Simple function to get dev stats
export const getDevStats = async (req, res, next) => {
  const password = req.query.password;

  if (password !== DEV_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  }

  const friends = await loadData();
  const stats = {
    stats: {
      totalFriends: friends.length,
      totalViews: friends.reduce((sum, f) => sum + (f.viewCount || 0), 0),
      viewedMessages: friends.filter((f) => f.viewed).length,
      snoopingAttempts: 0, // We'll add this later
    },
    friends: friends.map((friend) => ({
      name: friend.name,
      id: friend.id,
      message: friend.message.substring(0, 50) + "...", // Short preview
      viewed: friend.viewed || false,
      viewCount: friend.viewCount || 0,
      lastViewed: friend.lastViewed || null,
      firstViewed: friend.firstViewed || null,
      devices: [], // Empty for now
    })),
  };
  res.status(200).json(stats);
  // return  stats;
};

export const mailer = async (req, res, next) => {
  const { name, email, message, url } = req.body;
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sends to yourself
    subject: `Valentine Project - Message from ${name || "Anonymous"}`,
    html: `
            <h2>New message from your Valentine project</h2>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email || "Not provided"}</p>
            <p><strong>Broken URL:</strong> ${url || window.location.href}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: "Failed to send" });
  }
};

export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per hour
  message: { success: false, error: "Too many requests. Try again later." },
});
