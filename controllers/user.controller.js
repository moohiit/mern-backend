import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register controller
export const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    // validate the data
    if (!fullname || !email || !password) {
      return res.status(401).json({
        message: "Please fill in all fields",
        success: false,
      });
    }

    // Check if user already exists
    const existedUser = await User.findOne({ email }); // Use findOne instead of find
    if (existedUser) {
      return res.status(401).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(500).json({
        message: "Failed to create user",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log("Something went wrong: ", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate the data
    if (!email || !password) {
      return res.status(401).json({
        message: "Please fill in all fields",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    // Return the response with the token
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

//get user profile Controller
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    // console.log(user);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller to fetch users
export const getUsers = async (req, res) => { 
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({
        message: "No users found",
        success: false
      });
    }
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

//Logout Controller
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Edit profile Controller
export const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {fullname, email, bio, mobile } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    //Check the below in case it not work
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.mobile = mobile || user.mobile;
    
    //Save the changes in the database
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      })
    };
    return res.status(200).json({
      message: "User deleted successfully",
      success:true
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
