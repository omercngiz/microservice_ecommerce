import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller';

const router: Router = Router();

router.get('/test', (req, res) => {
  res.json({ message: 'works' });
});

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);

export default router;