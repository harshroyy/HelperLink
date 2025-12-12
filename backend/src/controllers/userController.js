const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate a Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token lasts for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, city } = req.body;

    // 1. Check if all fields are present
    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash the password (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'receiver', // Default to receiver if not specified
      city
    });

    // 5. Respond with data + Token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login a user
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for email
    const user = await User.findOne({ email }).select('+passwordHash');

    // 2. Check if user exists AND password matches
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all helpers
// @route   GET /api/users/helpers
exports.getHelpers = async (req, res) => {
  try {
    // Find users with role 'helper' and exclude the passwordHash field
    const helpers = await User.find({ role: 'helper' }).select('-passwordHash');
    res.json(helpers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update User Profile
// @route   PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
  try {
    // req.user.id comes from the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (user) {
      // 1. Update Common Fields
      user.name = req.body.name || user.name;
      user.city = req.body.city || user.city;
      user.bio = req.body.bio || user.bio;
      user.headline = req.body.headline || user.headline;
      user.profileImage = req.body.profileImage || user.profileImage;

      // 2. Update Socials (Merge existing with new data)
      if (req.body.socials) {
        user.socials = {
          github: req.body.socials.github || user.socials?.github,
          linkedin: req.body.socials.linkedin || user.socials?.linkedin,
          twitter: req.body.socials.twitter || user.socials?.twitter
        };
      }

      // 3. Update Password (if provided)
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(req.body.password, salt);
      }

      // 4. Update Role-Specific Data
      if (user.role === 'helper') {
        if (req.body.skills) user.helperProfile.skills = req.body.skills;
        if (req.body.resources) user.helperProfile.resources = req.body.resources;
        // Check explicitly for boolean (true/false)
        if (req.body.isAvailable !== undefined) user.helperProfile.isAvailable = req.body.isAvailable;
      }
      else if (user.role === 'receiver') {
        if (req.body.needs) user.receiverProfile.needs = req.body.needs;
      }

      // 5. Save the updated user
      const updatedUser = await user.save();

      // 6. Return the fresh data
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        city: updatedUser.city,
        role: updatedUser.role,
        bio: updatedUser.bio,
        headline: updatedUser.headline,
        profileImage: updatedUser.profileImage,
        socials: updatedUser.socials,
        helperProfile: updatedUser.helperProfile,
        receiverProfile: updatedUser.receiverProfile,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};