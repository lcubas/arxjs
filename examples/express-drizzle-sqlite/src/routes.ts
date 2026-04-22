import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { checkPermission } from './middleware';

export const router: ExpressRouter = Router();

router.get('/posts', checkPermission('posts:read'), (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Learn ARX with Drizzle', content: 'ARX is a modern authz library...' },
      {
        id: 2,
        title: 'Express and SQLite integration',
        content: 'Drizzle makes it easy to manage schemas...',
      },
    ],
    message: 'Post list retrieved successfully.',
  });
});

router.post('/posts', checkPermission('posts:create'), (req, res) => {
  res.status(201).json({
    success: true,
    data: { id: 3, ...req.body },
    message: 'New post created.',
  });
});

router.put('/posts/:id', checkPermission('posts:update'), (req, res) => {
  res.json({
    success: true,
    message: `Post with ID ${req.params.id} updated.`,
  });
});

router.delete('/posts/:id', checkPermission('posts:delete'), (req, res) => {
  res.json({
    success: true,
    message: `Post with ID ${req.params.id} deleted.`,
  });
});
