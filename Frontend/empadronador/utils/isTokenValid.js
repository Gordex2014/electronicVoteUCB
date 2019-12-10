import jwt from "jsonwebtoken";

export default function tokenExpired(token) {
  let isTokenValid = true;
  if (token && jwt.decode(token)) {
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    isTokenValid = now.getTime() < expiry * 1000;
  } else if (token === null) {
    isTokenValid = false;
  } else if (token === undefined) {
    isTokenValid = false;
  } else {
    isTokenValid = true;
  }
  return isTokenValid;
}
