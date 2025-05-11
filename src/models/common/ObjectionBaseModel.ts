import { omit } from 'lodash';
import { Model, Pojo } from 'objection';

class ObjectionBaseModel extends Model {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  isSkipUpdatedAt?: boolean;

  static get modelPaths(): string[] {
    return [__dirname];
  }

  get $secureFields(): string[] {
    return [];
  }

  static modifiers = {
    defaultSoftDelete(query) {
      query.whereNull('deleted');
    }
  };

  async softDelete() {
    return await this.$query().patchAndFetch({
      deletedAt: new Date()
    });
  }

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    return omit(json, this.$secureFields);
  }

  $beforeInsert(): void {
    const currentTime = new Date();
    if (!this.createdAt) {
      this.createdAt = currentTime;
    }
    if (!this.updatedAt) {
      this.updatedAt = currentTime;
    }
  }

  $beforeUpdate(): void {
    if (!this.isSkipUpdatedAt) {
      this.updatedAt = new Date();
    }
  }
}

export default ObjectionBaseModel;
