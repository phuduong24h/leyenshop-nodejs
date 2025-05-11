import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import Product from './Product';

class ProductFeatured extends ObjectionBaseModel {
  id!: number;
  categoryFeaturedId?: number;
  productId?: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'product_featured';

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_featured.productId',
          to: 'product.id'
        }
      }
    };
  }
}

export default ProductFeatured;
