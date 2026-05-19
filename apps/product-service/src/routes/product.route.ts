import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from '../controllers/product.controller';
import { shouldBeAdmin } from '../middleware/auth';

const router: Router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'works' });
});

router.post('/', shouldBeAdmin, createProduct);
router.put('/:id', shouldBeAdmin, updateProduct);
router.delete('/:id', shouldBeAdmin, deleteProduct);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

export default router;