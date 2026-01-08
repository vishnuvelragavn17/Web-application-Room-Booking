export const isValidMobile = (mobile: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isNotEmpty = (val: string): boolean => {
  return val.trim().length > 0;
};
