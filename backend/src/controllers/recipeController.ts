import { Request, Response } from 'express';
import { VideoParserService } from '../services/videoParser';
import { AIAnalyzerService } from '../services/aiAnalyzer';
import { Creator } from '../models/Creator';
import { RecipeCard } from '../models/RecipeCard';

export class RecipeController {
  /**
   * Submit a video URL for parsing and AI analysis
   * POST /api/analyze
   */
  public static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const { url, llmConfig } = req.body;
      if (!url) {
        res.status(400).json({ error: 'Video URL is required' });
        return;
      }

      // 1. Parse video
      const parsedVideo = await VideoParserService.parseUrl(url);

      // 2. Find or create Creator
      let creator = await Creator.findOne({ where: { secUid: parsedVideo.author.secUid } });
      if (!creator) {
        await Creator.create({
          secUid: parsedVideo.author.secUid,
          nickname: parsedVideo.author.nickname,
          avatarUrl: parsedVideo.author.avatarUrl,
          description: parsedVideo.author.description,
        });
        creator = await Creator.findOne({ where: { secUid: parsedVideo.author.secUid } });
      }
      
      if (!creator) {
        throw new Error('Failed to create or find creator');
      }

      // 3. Fetch creator's previous recipe cards for context
      const historyCards = await RecipeCard.findAll({
        where: { creatorId: creator.getDataValue('id') || creator.id },
        order: [['createdAt', 'DESC']],
        limit: 5,
      });

      // 4. AI Analysis
      const analysisResult = await AIAnalyzerService.analyzeVideo(
        parsedVideo.title,
        parsedVideo.description,
        historyCards,
        llmConfig
      );

      // 5. Save RecipeCard
      let recipeCard = await RecipeCard.create({
        videoUrl: parsedVideo.videoUrl,
        title: parsedVideo.title,
        summary: analysisResult.summary,
        dimensions: analysisResult.dimensions,
        actionAdvice: analysisResult.actionAdvice,
        creatorId: creator.getDataValue('id') || creator.id,
      });
      recipeCard = await RecipeCard.findOne({ where: { id: recipeCard.getDataValue('id') || recipeCard.id } }) || recipeCard;


      res.status(200).json({
        success: true,
        data: {
          recipeCard,
          creator,
        }
      });
    } catch (error: any) {
      console.error('Error in analyze endpoint:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  /**
   * Get history of recipe cards
   * GET /api/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const { count, rows } = await RecipeCard.findAndCountAll({
        include: [{ model: Creator, as: 'creator' }],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        data: {
          total: count,
          items: rows,
        }
      });
    } catch (error: any) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get recipe card details by ID
   * GET /api/recipe/:id
   */
  public static async getRecipeDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const recipeCard = await RecipeCard.findByPk(id, {
        include: [{ model: Creator, as: 'creator' }],
      });

      if (!recipeCard) {
        res.status(404).json({ error: 'Recipe card not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: recipeCard,
      });
    } catch (error: any) {
      console.error('Error fetching recipe detail:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get home recommendations (Featured creators and trending recipes)
   * GET /api/recommendations
   */
  public static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      // Mocking recommendation logic by fetching recent creators and popular recipes
      const featuredCreators = await Creator.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
      });

      const trendingRecipes = await RecipeCard.findAll({
        include: [{ model: Creator, as: 'creator' }],
        limit: 10,
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        success: true,
        data: {
          featuredCreators,
          trendingRecipes,
        }
      });
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
