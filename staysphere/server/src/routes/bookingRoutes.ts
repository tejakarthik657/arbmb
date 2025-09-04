import { Router } from 'express';
import {
    getUserBookings,
    createBooking,
    cancelBooking
} from '../controllers/bookingController';

const router = Router();

router.get('/user/:userId', getUserBookings);
router.post('/', createBooking);
router.post('/:id/cancel', cancelBooking);

export default router;
