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
  // PORT
  port: verifyEnv('PORT') as number,
  // DATABASE
  databaseUrl: verifyEnv('DATABASE_URL') as string,
  // TOKEN
  accessSecretKey: verifyEnv('ACCESS_SECRET_KEY') as string,
  refreshSecretKey: verifyEnv('REFRESH_SECRET_KEY') as string,
  accessExpiryUnit: verifyEnv('ACCESS_EXPIRY_UNIT') as string,
  refreshExpiryUnit: verifyEnv('REFRESH_EXPIRY_UNIT') as string,
  accessExpiryValue: verifyEnv('ACCESS_EXPIRY_VALUE') as number,
  refreshExpiryValue: verifyEnv('REFRESH_EXPIRY_VALUE') as number,
};

export default env;
