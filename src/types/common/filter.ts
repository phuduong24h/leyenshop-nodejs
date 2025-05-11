import { Expression, PrimitiveValue } from 'objection';

export interface IFilterItem {
  field: string;
  operator: string;
  value: string | number | boolean | [Expression<PrimitiveValue>, Expression<PrimitiveValue>];
  or?: IFilterItem[];
}
