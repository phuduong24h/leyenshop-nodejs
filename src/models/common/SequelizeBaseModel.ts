import { Model } from 'sequelize';

interface ISequelizeBaseModal {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class SequelizeBaseModel<T> extends Model<T & ISequelizeBaseModal> {}

export default SequelizeBaseModel;
