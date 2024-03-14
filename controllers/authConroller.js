const User = require("../models/userModel");
const { createJWT } = require("../utils");

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(401).json({ success: false, message: "Please fill all required fields." });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(402).json({ success: false, message: "User is not available" });
        }

        if (password !== existingUser.password) {
            return res.status(403).json({ success: false, message: "Invalid password" });
        }

        // For simplicity, assuming createJWT function creates a JWT token
        const accessToken = createJWT(existingUser._id);
        console.log(accessToken)
        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: existingUser,
            accessToken,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, batch, course, courseEnrolled, role, password } = req.body;
         console.log(name, email, batch, course, courseEnrolled, role, password)
        if (name == null && email == null && batch == null && course == null && courseEnrolled == null && role == null && password == null) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            batch,
            course,
            courseEnrolled,
            role,
            password
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

 const forgetPassword = async (req, res) => {
    try {
      // Find the user by email
      const user = await User.findOne({ mail: req.body.email });
  
      // If user not found, send error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Generate a unique JWT token for the user that contains the user's id
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {expiresIn: "10m",});
  
      // Send the token to the user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_APP_EMAIL,
        },
      });
  
      // Email configuration
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Reset Password",
        html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: "Email sent" });
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };


   const resetPassword = async (req, res) => {
    try {
      // Verify the token sent by the user
      const decodedToken = jwt.verify(
        req.params.token,
        process.env.JWT_SECRET_KEY
      );
  
      // If the token is invalid, return an error
      if (!decodedToken) {
        return res.status(401).send({ message: "Invalid token" });
      }
  
      // find the user with the id from the token
      const user = await User.findOne({ _id: decodedToken.userId });
      if (!user) {
        return res.status(401).send({ message: "no user found" });
      }
      
      // Hash the new password
      const salt = await bycrypt.genSalt(10);
      req.body.newPassword = await bycrypt.hash(req.body.newPassword, salt);
  
      // Update user's password, clear reset token and expiration time
      user.password = req.body.newPassword;
      await user.save();
  
      // Send success response
      res.status(200).send({ message: "Password updated" });
    } catch (err) {
      // Send error response if any error occurs
      res.status(500).send({ message: err.message });
    }
  };


module.exports = { register, login, forgetPassword, resetPassword };
