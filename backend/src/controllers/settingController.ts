import { Request, Response } from 'express';
import { Setting } from '../models/Setting';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let setting = await Setting.findByPk(1);
    if (!setting) {
      setting = await Setting.create({ id: 1, apiKey: '', baseUrl: '', model: 'gpt-4o-mini' });
    }
    res.json({
      success: true,
      data: setting.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { apiKey, baseUrl, model } = req.body;
    let setting = await Setting.findByPk(1);
    
    if (!setting) {
      setting = await Setting.create({ id: 1, apiKey, baseUrl, model });
    } else {
      await setting.update({
        apiKey: apiKey !== undefined ? apiKey : setting.getDataValue('apiKey'),
        baseUrl: baseUrl !== undefined ? baseUrl : setting.getDataValue('baseUrl'),
        model: model !== undefined ? model : setting.getDataValue('model')
      });
    }
    
    res.json({ success: true, data: setting.toJSON() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
