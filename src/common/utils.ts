import * as bcrypt from 'bcrypt';

export async function hash(password: string): Promise<string> {
  const salt = 10;
  return bcrypt.hash(password, salt);
}
