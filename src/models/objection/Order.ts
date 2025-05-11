import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import OrderDetail from './OrderDetail';
import Product from './Product';
import User from './User';

class Order extends ObjectionBaseModel {
  id!: number;
  userId: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: number;
  shippingFee: number;
  paymentPaid: number;
  paymentMethod: 'cash' | 'credit';
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  products?: Product[];
  orderDetails?: OrderDetail[];

  static tableName = 'order';

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'order.userId',
          to: 'user.id'
        }
      },
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'order.id',
          through: {
            from: 'order_detail.orderId',
            to: 'order_detail.productId'
          },
          to: 'product.id'
        }
      },
      orderDetails: {
        relation: Model.HasManyRelation,
        modelClass: OrderDetail,
        join: {
          from: 'order.id',
          to: 'order_detail.orderId'
        }
      }
    };
  }
}

export default Order;
