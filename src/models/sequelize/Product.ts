import { DataTypes } from 'sequelize';

import { sequelizePostgres } from 'configs/database';
import { SequelizeBaseModel } from 'models/common';

interface Fields {
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
}

class Product extends SequelizeBaseModel<Fields> {}

Product.init(
  {
    name: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.NUMBER
    },
    description: {
      type: DataTypes.STRING
    },
    inventoryCount: {
      type: DataTypes.INTEGER
    }
  },
  { sequelize: sequelizePostgres, modelName: 'Products' }
);

export default Product;
