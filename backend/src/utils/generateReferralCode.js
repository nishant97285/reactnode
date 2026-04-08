const generateReferralCode = (name) => {
  const prefix = name.substring(0, 2).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

export default generateReferralCode;