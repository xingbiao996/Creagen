import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import './models/Creator';
import './models/RecipeCard';
import './models/Setting';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import recipeRoutes from './routes/recipeRoutes';
import settingRoutes from './routes/settingRoutes';
import { setupSwagger } from './config/swagger';

app.use('/api', recipeRoutes);
app.use('/api/settings', settingRoutes);
setupSwagger(app);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Creagen API is running' });
});

// Sync Database and Start Server
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
