import dotenv from 'dotenv';

dotenv.config();

const verifyEnv = (name: string): unknown => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing env[${name}]`);
  }
  return value;
};

const env = {
  port: verifyEnv('PORT'),
};

export default env;
