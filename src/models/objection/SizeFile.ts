import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import File from './File';

class SizeFile extends ObjectionBaseModel {
  id!: number;
  sizeId: number;
  fileId: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'size_file';

  static get relationMappings() {
    return {
      file: {
        relation: Model.HasOneRelation,
        modelClass: File,
        join: {
          from: 'size_file.fileId',
          to: 'file.id'
        }
      }
    };
  }
}

export default SizeFile;
