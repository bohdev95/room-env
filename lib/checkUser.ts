import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
// Encrypted web tokens generted with : `openssl rand -base64 32`
const secret = "VyzSom3cx4s4C0WQvctLDDenHdF6Svk+JBptAtz7qUg=";

export const hasToken = async (req: NextApiRequest) => {
  const token = await getToken({ req, secret });
  if (!token) {
    return false;
  }
  return true;
};
