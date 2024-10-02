const formatCurrency = (number) => {
  
  if (typeof number !== 'number' || isNaN(number)) {
    return '0'; 
  }
  return number.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
};

export default formatCurrency;
