import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import File from './File';

class ColorFile extends ObjectionBaseModel {
  id!: number;
  colorId: number;
  fileId: number;
  createdAt: Date;
  updatedAt: Date;

  file?: File;

  static tableName = 'color_file';

  static get relationMappings() {
    return {
      file: {
        relation: Model.HasOneRelation,
        modelClass: File,
        join: {
          from: 'color_file.fileId',
          to: 'file.id'
        }
      }
    };
  }
}

export default ColorFile;
