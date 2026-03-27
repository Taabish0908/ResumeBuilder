import jwt from "jsonwebtoken";
import { format, toZonedTime } from "date-fns-tz";
export const generateToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const expiresInMilliseconds7Days = 7 * 24 * 60 * 60 * 1000;
  const expiryTime = Date.now() + expiresInMilliseconds7Days;
  if (!JWT_SECRET)
    throw new Error("JWT_SECRET environment variable is not set");
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: Math.floor(expiryTime / 1000),
  });
  const expiryDateUTC = new Date(expiryTime);
  const timeZone = "UTC"; // Explicitly set UTC
  const zonedTime = toZonedTime(expiryDateUTC, timeZone);
  const expiryDate = format(zonedTime, "do MMMM, yyyy 'UTC'", { timeZone });
  const expiryTimeOfDay = format(zonedTime, "HH:mm 'UTC'", { timeZone });

  const data = {
    token,
    TokenExpiresIn: expiryTime, // Duration in milliseconds
    TokenExpiresOn: `${expiryDate} at ${expiryTimeOfDay}`, // Human-readable format
    ExpiresOnUTC: expiryDateUTC.toISOString(), // ISO UTC format for machine-readable purposes
  };
  return data;
};
