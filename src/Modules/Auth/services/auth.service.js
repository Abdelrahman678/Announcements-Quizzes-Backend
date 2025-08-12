import { User, BlackListTokens } from "../../../DB/models/index.model.js";
import { compareSync } from "bcrypt";
import { generateToken, verifyToken } from "../../../Utils/token.utils.js";
import { v4 as uuidv4 } from "uuid";

export const signUpService = async (req, res) => {
  /* Destructure req.body */
  const { username, email, password, age, gender } = req.body;

  /* Check if user already exists */
  const isEmailExist = await User.findOne({ email: email });
  if (isEmailExist) {
    return res
      .status(409)
      .json({ message: "Email already exist. Please try another email." });
  }

  /* Create User */
  const user = new User({
    username,
    email,
    password,
    age,
    gender,
  });

  /* Save User */
  await user.save();

  /* Return error response */
  if (!user) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }

  /* Return success response */
  return res.status(201).json({
    message: "User created successfully",
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      age: user.age,
      gender: user.gender,
    },
  });
};

export const signInService = async (req, res) => {
  /* destructure request body */
  const { email, password } = req.body;
  /* find user by email */
  const user = await User.findOne({ email: email });
  /* return error if user not found */
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  /* compare password */
  const isPasswordMatch = compareSync(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  /* generate tokens */
  const accessToken = generateToken({
    publicClaims: { _id: user._id },
    registeredClaims: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      jwtid: uuidv4(),
    },
    secretKey: process.env.JWT_SECRET_LOGIN,
  });

  /* return success response */
  return res.status(200).json({
    message: "User logged in successfully",
    accessToken,
  });
};

export const signOutService = async (req, res) => {
  /* destructure request headers */
  const { accesstoken } = req.headers;
  /* verify access token */
  const decoded = verifyToken({
    token: accesstoken,
    secretKey: process.env.JWT_SECRET_LOGIN,
  });
  /* insert tokens in black list */
  await BlackListTokens.insertMany([
    { tokenId: decoded.jti, expiryDate: decoded.exp },
  ]);
  /* return success response */
  return res.status(200).json({
    message: "User logged out successfully",
  });
};
