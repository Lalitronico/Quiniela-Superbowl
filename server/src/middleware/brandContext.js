import { getBrandBySlug } from '../services/databaseService.js';

/**
 * Middleware that validates and loads brand context from the :brand URL parameter.
 * Attaches the brand object to req.brand for use in route handlers.
 */
export async function brandContext(req, res, next) {
  const { brand: brandSlug } = req.params;

  if (!brandSlug) {
    return res.status(400).json({
      error: 'Brand slug is required',
      code: 'BRAND_REQUIRED',
    });
  }

  // Validate slug format (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/.test(brandSlug)) {
    return res.status(400).json({
      error: 'Invalid brand slug format',
      code: 'INVALID_BRAND_SLUG',
    });
  }

  try {
    const brand = await getBrandBySlug(brandSlug);

    if (!brand) {
      return res.status(404).json({
        error: 'Brand not found',
        code: 'BRAND_NOT_FOUND',
      });
    }

    if (!brand.isActive) {
      return res.status(403).json({
        error: 'Brand is not active',
        code: 'BRAND_INACTIVE',
      });
    }

    // Attach brand to request for use in route handlers
    req.brand = brand;
    req.brandId = brand.id;

    next();
  } catch (error) {
    console.error('Error loading brand context:', error);
    res.status(500).json({
      error: 'Failed to load brand',
      code: 'BRAND_LOAD_ERROR',
    });
  }
}

/**
 * Check if predictions are locked for this brand.
 * Returns true if predictions should be blocked.
 */
export function arePredictionsLocked(brand) {
  if (!brand.predictionsLockAt) {
    return false;
  }
  return new Date() > new Date(brand.predictionsLockAt);
}

export default brandContext;
