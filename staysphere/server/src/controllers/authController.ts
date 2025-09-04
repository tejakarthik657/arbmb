import { Request, Response } from 'express';
import { DatabaseService } from '../database';
import { User } from '../../../shared/types';

export const login = (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = DatabaseService.getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Mock password check
    if (password !== 'password') {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({ success: true, data: { user, token: 'mock-jwt-token' } });
};

export const register = (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (DatabaseService.getUserByEmail(email)) {
        return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const newUser = DatabaseService.createUser({ email, firstName, lastName, isHost: false });
    res.status(201).json({ success: true, data: { user: newUser, token: 'mock-jwt-token' } });
};

export const getMe = (req: Request, res: Response) => {
    // In a real app, you'd get the user from the token
    // For this mock, we'll just return a default user
    const user = DatabaseService.getUserById('demo-user-1');
    if (user) {
        res.json({ success: true, data: { user, token: 'mock-jwt-token' } });
    } else {
        res.status(404).json({ success: false, error: 'User not found' });
    }
};
