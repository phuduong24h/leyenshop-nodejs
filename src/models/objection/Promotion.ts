import { ObjectionBaseModel } from 'models/common';

class Promotion extends ObjectionBaseModel {
  id!: number;
  name: string;
  type: 'invoice' | 'product';
  status: 'active' | 'inactive';
  from: Date;
  to: Date;
  minAmount: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'promotion';
}

export default Promotion;
