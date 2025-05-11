import { get } from 'lodash';

import { IResponseLazySuccess, IResponseSuccess } from 'types/common';

export const responseSuccess = ({ success = true, status = 200, message = '', data = null }: IResponseSuccess = {}) => {
  return { success, status, message: message?.toString?.(), data };
};

export const responsePaginationSuccess = ({
  hasPagination,
  results,
  total,
  currentPage,
  pageSize
}: IResponseLazySuccess) => {
  return {
    hasPagination,
    results,
    total,
    currentPage,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};

export const responseError = ({
  success = false,
  status = 400,
  message,
  error
}: {
  success?: boolean;
  status?: number;
  message?: string;
  error?: object;
} = {}) => {
  return {
    success,
    status,
    message: get(error, 'message', error)?.toString?.() || message?.toString?.() || 'Server error'
  };
};
