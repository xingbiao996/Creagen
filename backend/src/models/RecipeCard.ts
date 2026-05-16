import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Creator } from './Creator';

export class RecipeCard extends Model {
  public id!: number;
  public videoUrl!: string;
  public title!: string;
  public summary!: string;
  public dimensions!: any; // JSON string or JSON object for the 7 dimensions
  public actionAdvice!: any; // JSON for action advices
  public creatorId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RecipeCard.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.JSON, // SQLite supports JSON type in sequelize, it stores as text
      allowNull: false,
    },
    actionAdvice: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Creator,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'recipe_cards',
  }
);

// Define Associations
Creator.hasMany(RecipeCard, { foreignKey: 'creatorId', as: 'recipeCards' });
RecipeCard.belongsTo(Creator, { foreignKey: 'creatorId', as: 'creator' });
