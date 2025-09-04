import { Request, Response } from 'express';
import { DatabaseService } from '../database';

export const getUserBookings = (req: Request, res: Response) => {
    const { userId } = req.params; // Assuming userId is passed in params for simplicity
    const bookings = DatabaseService.getBookings(userId);
    const bookingsWithProperties = bookings.map(booking => {
        const property = DatabaseService.getPropertyById(booking.propertyId);
        return { ...booking, property: property || undefined };
    });
    res.json({ success: true, data: bookingsWithProperties });
};

export const createBooking = (req: Request, res: Response) => {
    const bookingData = req.body;

    const property = DatabaseService.getPropertyById(bookingData.propertyId);
    if (!property) {
        return res.status(404).json({ success: false, error: 'Property not found' });
    }

    // Simplified availability check
    const existingBookings = DatabaseService.getBookings();
    const conflictingBooking = existingBookings.find(booking =>
        booking.propertyId === bookingData.propertyId &&
        booking.status !== 'cancelled' &&
        (
            (new Date(bookingData.checkIn) >= new Date(booking.checkIn) && new Date(bookingData.checkIn) < new Date(booking.checkOut)) ||
            (new Date(bookingData.checkOut) > new Date(booking.checkIn) && new Date(bookingData.checkOut) <= new Date(booking.checkOut))
        )
    );

    if (conflictingBooking) {
        return res.status(400).json({ success: false, error: 'Property is not available for the selected dates' });
    }

    const newBooking = DatabaseService.createBooking({ ...bookingData, status: 'confirmed' });
    res.status(201).json({ success: true, data: newBooking });
};

export const cancelBooking = (req: Request, res: Response) => {
    const { id } = req.params;
    const cancelledBooking = DatabaseService.cancelBooking(id);
    if (cancelledBooking) {
        res.json({ success: true, data: cancelledBooking });
    } else {
        res.status(404).json({ success: false, error: 'Booking not found' });
    }
};
