import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import Color from './Color';
import Order from './Order';
import Product from './Product';
import Size from './Size';

class OrderDetail extends ObjectionBaseModel {
  id!: number;
  orderId: number;
  productId: number;
  sizeId: number;
  colorId: number;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'order_detail';

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'order_detail.orderId',
          to: 'order.id'
        }
      },
      product: {
        relation: Model.HasOneRelation,
        modelClass: Product,
        join: {
          from: 'order_detail.productId',
          to: 'product.id'
        }
      },
      size: {
        relation: Model.HasOneRelation,
        modelClass: Size,
        join: {
          from: 'order_detail.sizeId',
          to: 'size.id'
        }
      },
      color: {
        relation: Model.HasOneRelation,
        modelClass: Color,
        join: {
          from: 'order_detail.colorId',
          to: 'color.id'
        }
      }
    };
  }
}

export default OrderDetail;
