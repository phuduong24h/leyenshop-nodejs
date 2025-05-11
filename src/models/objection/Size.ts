import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import File from './File';

class Size extends ObjectionBaseModel {
  id!: number;
  name: string;
  sizePrice: number;
  productId: number;

  fileId: string[];
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'size';

  static get relationMappings() {
    return {
      files: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'size.id',
          through: {
            from: 'size_file.sizeId',
            to: 'size_file.fileId'
          },
          to: 'file.id'
        }
      }
    };
  }
}

export default Size;
