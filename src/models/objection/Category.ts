import { ObjectionBaseModel } from 'models/common';

class Category extends ObjectionBaseModel {
  id!: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'category';
}

export default Category;
