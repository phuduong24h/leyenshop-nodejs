import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import Category from './Category';
import Product from './Product';
import ProductFeatured from './ProductFeatured';

class CategoryFeatured extends ObjectionBaseModel {
  id!: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;

  category?: Category;
  products?: Product[];
  productFeatured?: ProductFeatured[];

  static tableName = 'category_featured';

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'category_featured.categoryId',
          to: 'category.id'
        }
      },
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'category_featured.id',
          through: {
            from: 'product_featured.categoryFeaturedId',
            to: 'product_featured.productId'
          },
          to: 'product.id'
        }
      },
      productFeatured: {
        relation: Model.HasManyRelation,
        modelClass: ProductFeatured,
        join: {
          from: 'category_featured.id',
          to: 'product_featured.categoryFeaturedId'
        }
      }
    };
  }
}

export default CategoryFeatured;
