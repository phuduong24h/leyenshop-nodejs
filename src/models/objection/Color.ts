import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import ColorFile from './ColorFile';
import File from './File';

class Color extends ObjectionBaseModel {
  id!: number;
  name: string;
  productId: number;
  createdAt: Date;
  updatedAt: Date;

  files: ColorFile[];

  static tableName = 'color';

  static get relationMappings() {
    return {
      files: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'color.id',
          through: {
            from: 'color_file.colorId',
            to: 'color_file.fileId'
          },
          to: 'file.id'
        }
      }
    };
  }
}

export default Color;
