import { Request, Response } from 'express';
import { DatabaseService } from '../database';

export const getPropertyReviews = (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const reviews = DatabaseService.getReviewsForProperty(propertyId);
    res.json({ success: true, data: reviews });
};

export const createReview = (req: Request, res: Response) => {
    const newReview = DatabaseService.createReview(req.body);
    // In a real app, we'd fetch the full guest object
    const guest = DatabaseService.getUserById(newReview.guestId);
    res.status(201).json({ success: true, data: { ...newReview, guest } });
};
