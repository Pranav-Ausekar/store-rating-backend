import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/UserModel.js';

export const register = async (req, res) => {
    const { name, email, password, address, role = 'user' } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // encrypt or hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await createUser(name, email, address, hashedPassword, role);

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "User doesn't exist" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Handle valid roles only
        if (
            user.role !== 'user' &&
            user.role !== 'admin' &&
            user.role !== 'store-owner'
        ) {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
        );

        // Send role in response
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
};