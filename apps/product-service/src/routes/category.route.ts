import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller';
import { verifyHmac } from '@digitalocean/hmac-middleware';

const router: Router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'works' });
});

router.post('/', verifyHmac, createCategory);
router.put('/:id', verifyHmac, updateCategory);
router.delete('/:id', verifyHmac, deleteCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);

export default router;