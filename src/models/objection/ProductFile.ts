import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import File from './File';

class ProductFile extends ObjectionBaseModel {
  id!: number;
  productId: number;
  fileId: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'product_file';

  static get relationMappings() {
    return {
      product_file: {
        relation: Model.HasOneRelation,
        modelClass: File,
        join: {
          from: 'product_file.fileId',
          to: 'file.id'
        }
      }
    };
  }
}

export default ProductFile;
