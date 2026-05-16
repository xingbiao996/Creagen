import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Setting extends Model {
  public id!: number;
  public apiKey!: string;
  public baseUrl!: string;
  public model!: string;
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    baseUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'settings',
  }
);
