import { Router } from 'express';

const router = Router({ mergeParams: true });

/**
 * GET /:brand/brand-info
 * Returns public information about the brand for frontend theming.
 * Requires brandContext middleware.
 */
router.get('/brand-info', (req, res) => {
  const { brand } = req;

  res.json({
    slug: brand.slug,
    name: brand.name,
    logoUrl: brand.logoUrl,
    primaryColor: brand.primaryColor,
    predictionsLockAt: brand.predictionsLockAt,
  });
});

export default router;
