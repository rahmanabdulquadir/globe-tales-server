import jwt from "jsonwebtoken";

export interface ITokenPayload {
  email: string;
  role: string;
  id: string;
}
export const createAcessToken = (user: ITokenPayload, expires: string) => {
  console.log(process.env.JWT_REFRESH_SECRET);

  return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: expires,
  });
};
export const createRefreshToken = (user: object) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "30 days",
  });
};