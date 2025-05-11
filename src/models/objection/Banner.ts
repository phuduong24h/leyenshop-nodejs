import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import File from './File';

class Banner extends ObjectionBaseModel {
  id!: number;
  fileId: string;
  isPin: boolean;
  createdAt: Date;
  updatedAt: Date;

  file?: File;

  static tableName = 'banner';

  static get relationMappings() {
    return {
      file: {
        relation: Model.HasOneRelation,
        modelClass: File,
        join: {
          from: 'banner.fileId',
          to: 'file.id'
        }
      }
    };
  }
}

export default Banner;
