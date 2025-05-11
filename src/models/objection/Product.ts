import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import Category from './Category';
import Color from './Color';
import File from './File';
import Promotion from './Promotion';
import Size from './Size';

class Product extends ObjectionBaseModel {
  id!: number;
  name: string;
  price: number;
  detail: string;
  description: string;
  inventoryCount: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  promotionId?: number;

  files?: string[];
  colors?: Color[];
  sizes: Size[];

  static tableName = 'product';

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'product.categoryId',
          to: 'category.id'
        }
      },
      promotion: {
        relation: Model.BelongsToOneRelation,
        modelClass: Promotion,
        join: {
          from: 'product.promotionId',
          to: 'promotion.id'
        }
      },
      files: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'product.id',
          through: {
            from: 'product_file.productId',
            to: 'product_file.fileId'
          },
          to: 'file.id'
        }
      },
      colors: {
        relation: Model.HasManyRelation,
        modelClass: Color,
        join: {
          from: 'product.id',
          to: 'color.productId'
        }
      },
      sizes: {
        relation: Model.HasManyRelation,
        modelClass: Size,
        join: {
          from: 'product.id',
          to: 'size.productId'
        }
      }
    };
  }
}

export default Product;
