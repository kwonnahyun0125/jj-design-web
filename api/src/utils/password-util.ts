import bcrypt from 'bcrypt';

const saltOrRounds = 10;

// 비밀번호 암호화
export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, saltOrRounds);

// 비밀번호 비교
export const comparePassword = async (raw: string, hashed: string): Promise<boolean> =>
  await bcrypt.compare(raw, hashed);
