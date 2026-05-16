import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';

const router = Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get AI API settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update AI API settings
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *               baseUrl:
 *                 type: string
 *               model:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/', updateSettings);

export default router;
