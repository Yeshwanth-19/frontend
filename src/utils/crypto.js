import CryptoJS from 'crypto-js';

const getSecretKey = () => process.env.REACT_APP_AES_SECRET;

export function encryptAes(value) {
  const secretKey = getSecretKey();

  if (!secretKey) {
    throw new Error('AES encryption is not configured on the client');
  }

  return CryptoJS.AES.encrypt(value, secretKey).toString();
}
