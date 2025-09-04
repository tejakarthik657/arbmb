import { Request, Response } from 'express';
import { DatabaseService } from '../database';
import { SearchFilters } from '../../../shared/types';

export const searchProperties = (req: Request, res: Response) => {
    const { page = 1, limit = 12, ...filters } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const properties = DatabaseService.getProperties(filters as SearchFilters, pageNumber, limitNumber);
    res.json({ success: true, data: properties });
};

export const getFeaturedProperties = (req: Request, res: Response) => {
    const result = DatabaseService.getProperties(undefined, 1, 6);
    const featured = result.data
        .sort((a, b) => b.ratings.average - a.ratings.average)
        .slice(0, 4);
    res.json({ success: true, data: featured });
};

export const getPropertyById = (req: Request, res: Response) => {
    const { id } = req.params;
    const property = DatabaseService.getPropertyById(id);
    if (property) {
        res.json({ success: true, data: property });
    } else {
        res.status(404).json({ success: false, error: 'Property not found' });
    }
};

export const createProperty = (req: Request, res: Response) => {
    const newProperty = DatabaseService.createProperty(req.body);
    res.status(201).json({ success: true, data: newProperty });
};

export const updateProperty = (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProperty = DatabaseService.updateProperty(id, req.body);
    if (updatedProperty) {
        res.json({ success: true, data: updatedProperty });
    } else {
        res.status(404).json({ success: false, error: 'Property not found' });
    }
};

export const deleteProperty = (req: Request, res: Response) => {
    const { id } = req.params;
    const success = DatabaseService.deleteProperty(id);
    if (success) {
        res.json({ success: true, data: true });
    } else {
        res.status(404).json({ success: false, error: 'Property not found' });
    }
};
