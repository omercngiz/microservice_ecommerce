import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from '../controllers/product.controller';

const router: Router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'works' });
});

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

export default router;