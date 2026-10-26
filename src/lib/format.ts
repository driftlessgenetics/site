export const money = (amount = 0, currency = 'usd') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
