import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Creator extends Model {
  public id!: number;
  public secUid!: string;
  public nickname!: string;
  public avatarUrl!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Creator.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    secUid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'creators',
  }
);
