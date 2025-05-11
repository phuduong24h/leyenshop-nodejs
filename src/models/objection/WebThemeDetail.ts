import { ObjectionBaseModel } from 'models/common';

class WebThemeDetail extends ObjectionBaseModel {
  id!: number;
  webThemeId: number;
  name: string;
  code: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'web_theme_detail';
}

export default WebThemeDetail;
