import { ObjectionBaseModel } from 'models/common';
import { IFileType } from 'types/common';

class File extends ObjectionBaseModel {
  id!: number;
  url: string;
  name: string;
  fileType: IFileType;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'file';
}

export default File;
