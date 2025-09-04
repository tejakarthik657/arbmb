import { Router } from 'express';
import {
    getPropertyReviews,
    createReview
} from '../controllers/reviewController';

const router = Router();

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', createReview);

export default router;
