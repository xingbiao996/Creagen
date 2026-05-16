import { Router } from 'express';
import { RecipeController } from '../controllers/recipeController';

const router = Router();

/**
 * @swagger
 * /analyze:
 *   post:
 *     summary: Submit a video URL for analysis
 *     description: Parses a video URL and uses AI to generate a recipe card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The video URL to analyze
 *     responses:
 *       200:
 *         description: Successfully analyzed the video
 *       400:
 *         description: Missing video URL
 *       500:
 *         description: Internal server error
 */
router.post('/analyze', RecipeController.analyze);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get history of recipe cards
 *     description: Retrieve a paginated list of previously generated recipe cards
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved history
 *       500:
 *         description: Internal server error
 */
router.get('/history', RecipeController.getHistory);

/**
 * @swagger
 * /recipe/{id}:
 *   get:
 *     summary: Get recipe card details
 *     description: Retrieve a specific recipe card by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recipe card
 *     responses:
 *       200:
 *         description: Successfully retrieved recipe card
 *       404:
 *         description: Recipe card not found
 *       500:
 *         description: Internal server error
 */
router.get('/recipe/:id', RecipeController.getRecipeDetail);

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get home recommendations
 *     description: Retrieve featured creators and trending recipes for the home page
 *     responses:
 *       200:
 *         description: Successfully retrieved recommendations
 *       500:
 *         description: Internal server error
 */
router.get('/recommendations', RecipeController.getRecommendations);

export default router;
