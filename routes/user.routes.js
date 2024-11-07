import {
  login,
  register,
  getProfile,
  getUsers,
  logout,
  editProfile,
} from "../controllers/user.controller.js";
import express from "express";

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Get user profile by ID route
router.get("/profile/:id", getProfile);

// Get all users route
router.get("/users", getUsers);

// Logout route
router.post("/logout", logout);

// Edit user profile route
router.put("/profile/:id/edit", editProfile);

//Delete a user
router.delete("/delete/:id");

export default router;
