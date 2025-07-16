import dotenv from 'dotenv';

dotenv.config();

const verifyEnv = (name: string): any => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing env[${name}]`);
  }
  return value;
};

const ENV = {
  PORT: verifyEnv('PORT'),
};

export default ENV;
