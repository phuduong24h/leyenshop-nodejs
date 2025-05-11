export const generateOrderCode = () => {
  const prefix = 'PY';
  const datePart = new Date()
    .toISOString()
    .slice(0, 20)
    .replace(/[-:T.]/g, ''); // YYYYMMDDHHmmss

  return `${prefix}${datePart}`;
};
