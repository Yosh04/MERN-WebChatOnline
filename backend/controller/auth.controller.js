import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password not match " });
    }

    const user = await User.findOne({ userName });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Hash password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePicture = `https://avatar.iran.liara.run/public/boy/?username=${userName}`;
    const girlPprofilePicture = `https://avatar.iran.liara.run/public/girld/?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePicture:
        gender === "male" ? boyProfilePicture : girlPprofilePicture,
    });

    if (newUser) {
      //generate JWT Token here.f
      generateTokenAndSetCookie(newUser.id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error to signup", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid credentials." });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error to login", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loguot = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    console.log("Error to logout", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
