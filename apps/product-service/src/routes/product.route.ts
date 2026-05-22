import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getProductBySlug, getProducts, updateProduct } from '../controllers/product.controller';
import { verifyHmac } from '@digitalocean/hmac-middleware';

const router: Router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'works' });
});

router.post('/', verifyHmac, createProduct);
router.put('/:id', verifyHmac, updateProduct);
router.delete('/:id', verifyHmac, deleteProduct);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);

export default router;