import { ObjectionBaseModel } from 'models/common';

class WebInfo extends ObjectionBaseModel {
  id!: number;
  name: string;
  logo: string;
  phone: string;
  address: string;
  zalo: string;
  zaloLink: string;
  facebook: string;
  facebookLink: string;
  contact: string;
  aboutUs: string;
  shippingPolicy: string;
  returnPolicy: string;
  termOfService: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'web_info';
}

export default WebInfo;
