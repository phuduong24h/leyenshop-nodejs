import { Request } from 'express';

import { OrderByDirection, QueryBuilder } from 'objection';

import { AUDIO_EXTENSIONS, CONVERT_EXTENSIONS, IMAGE_EXTENSIONS, isDevelopment, VIDEO_EXTENSIONS } from '@constants';
import { ObjectionBaseModel } from 'models/common';
import { IFilterItem } from 'types/common';

export function getExtension(url: string): string {
  let fileType = 'unknown';
  let extension = url?.split?.('.')?.pop?.();
  extension = `.${extension}`;

  const isAVideo = VIDEO_EXTENSIONS.includes(extension);
  const isAnAudio = AUDIO_EXTENSIONS.includes(extension);
  const isAnImage = IMAGE_EXTENSIONS.includes(extension);
  const isAConvert = CONVERT_EXTENSIONS.includes(extension);

  if (isAVideo) {
    fileType = 'video';
  } else if (isAnAudio) {
    fileType = 'audio';
  } else if (isAnImage) {
    fileType = 'image';
  } else if (isAConvert) {
    fileType = 'convert';
  }

  return fileType;
}

export const getPath = (url: string, req: Request) => {
  if (!url) return '';

  const protocol = req.protocol;
  const origin = req.headers.host;
  let host = 'http://localhost:3000';

  if (!isDevelopment) {
    host = `${protocol}://${origin}`;
  }

  return `${host}/${url}`;
};

export const sortJSON = (query: QueryBuilder<ObjectionBaseModel, unknown>, sorts: string[]) => {
  if (sorts?.length) {
    try {
      sorts.forEach(item => {
        const [field, value] = item.split(':') as [string, OrderByDirection];
        query.orderBy(field, value);
      });
    } catch (e) {
      throw new Error('SORT_ERROR');
    }
  }
};

export const filterJSON = (query: QueryBuilder<ObjectionBaseModel, unknown>, filters: IFilterItem[]) => {
  if (filters?.length) {
    try {
      filters.forEach(filter => {
        if (filter.or) {
          // Trường hợp OR (lồng nhiều điều kiện)
          query.orWhere(builder => {
            filterJSON(builder, filter.or);
          });
        } else {
          // Trường hợp điều kiện thông thường
          const { field, operator, value } = filter || {};
          if (!field || !operator) return;

          switch (operator) {
            case '=':
            case '>':
            case '>=':
            case '<':
            case '<=':
              query.where(field, operator, value as string | number | boolean);
              break;
            case '!=':
              query.whereNot(field, value as string | number | boolean);
              break;
            case 'like':
              query.where(field, 'like', `%${value}%`);
              break;
            case 'ilike':
              query.where(field, 'ilike', `%${value}%`);
              break;
            case 'in':
              if (Array.isArray(value)) query.whereIn(field, value);
              break;
            case 'notIn':
              if (Array.isArray(value)) query.whereNotIn(field, value);
              break;
            case 'between':
              if (Array.isArray(value) && value.length === 2) {
                query.whereBetween(field, value);
              }
              break;
            case 'notBetween':
              if (Array.isArray(value) && value.length === 2) {
                query.whereNotBetween(field, value);
              }
              break;
            default:
              throw new Error('FILTER_ERROR');
          }
        }
      });
    } catch (error) {
      throw new Error('FILTER_ERROR');
    }
  }
};
