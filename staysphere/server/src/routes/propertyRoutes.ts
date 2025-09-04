import { Router } from 'express';
import {
    searchProperties,
    getFeaturedProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController';

const router = Router();

router.get('/', searchProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
