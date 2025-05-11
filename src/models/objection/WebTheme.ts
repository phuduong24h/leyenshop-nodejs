import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import WebThemeDetail from './WebThemeDetail';

class WebTheme extends ObjectionBaseModel {
  id!: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  themes?: WebThemeDetail[];

  static tableName = 'web_theme';

  static get relationMappings() {
    return {
      themes: {
        relation: Model.HasManyRelation,
        modelClass: WebThemeDetail,
        join: {
          from: 'web_theme_detail.webThemeId',
          to: 'web_theme.id'
        }
      }
    };
  }
}

export default WebTheme;
