import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_orbit_notes_jwt_signing_key_observatory_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      displayName: user.display_name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An astronomer account with this email already exists.' });
    }

    // 12 rounds of bcrypt hashing as per specification
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await UserModel.create({
      email,
      password_hash,
      display_name: displayName || email.split('@')[0]
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Observatory account registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name
      }
    });
  } catch (err) {
    console.error('[AuthController] Signup error:', err);
    return res.status(500).json({ error: 'Server error during account registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Authenticated successfully. Welcome back to Orbit Notes.',
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name
      }
    });
  } catch (err) {
    console.error('[AuthController] Login error:', err);
    return res.status(500).json({ error: 'Server error during authentication.' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Astronomer profile not found.' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('[AuthController] Me error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};
