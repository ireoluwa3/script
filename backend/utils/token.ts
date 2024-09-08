import { jwtVerify, SignJWT } from "jose";
import crypto from "crypto";
import {
  APP_ACCESS_TOKEN_SECRET,
  APP_REFRESH_TOKEN_SECRET,
  APP_RESET_TOKEN_SECRET,
  JWT_EXPIRY,
  JWT_REFRESH_EXPIRY,
  JWT_RESET_EXPIRY,
} from "./constants";
import { makeUuid } from "./passwords";
import { RedisSingleton } from "./redis";

export const issuerKey = "platform";

export async function generateTokens(user) {
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  const csrfToken = crypto.randomBytes(24).toString("hex");
  const sessionId = crypto.randomBytes(24).toString("hex");
  const userSessionKey = `sessionId:${sessionId}`;

  const redis = RedisSingleton.getInstance();

  const userData = { refreshToken, csrfToken, sessionId, user };
  await redis.set(
    userSessionKey,
    JSON.stringify(userData),
    "EX",
    60 * 60 * 24 * 14
  );

  return { accessToken, refreshToken, csrfToken, sessionId };
}

export async function refreshTokens(user, sessionId) {
  const accessToken = await generateAccessToken(user);
  const csrfToken = crypto.randomBytes(24).toString("hex");

  // Assuming we fetch the existing session data to keep the refresh token and user info intact
  const redis = RedisSingleton.getInstance();
  const userSessionKey = `sessionId:${sessionId}`;
  const sessionData = await redis.get(userSessionKey);

  if (!sessionData) {
    throw new Error("Session not found. Please re-authenticate.");
  }

  const session = JSON.parse(sessionData);
  session.csrfToken = csrfToken;
  session.accessToken = accessToken;

  // Update the session data in Redis with the new access token and updated CSRF token
  await redis.set(
    userSessionKey,
    JSON.stringify(session),
    "EX",
    60 * 60 * 24 * 14
  ); // Extend session expiry

  return { accessToken, csrfToken };
}

// Generate Access Token
export const generateAccessToken = async (user: any): Promise<string> => {
  const jwtClaims = {
    sub: user,
    iss: issuerKey,
    jti: makeUuid(),
  };

  return new SignJWT(jwtClaims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(new TextEncoder().encode(APP_ACCESS_TOKEN_SECRET));
};

// Verify Access Token
export const verifyAccessToken = async (token: string): Promise<any> => {
  if (!token) {
    return null;
  }

  const cookieToken = token.includes(" ") ? token.split(" ")[1] : token;
  try {
    const { payload } = await jwtVerify(
      cookieToken,
      new TextEncoder().encode(APP_ACCESS_TOKEN_SECRET)
    );
    return payload;
  } catch (error) {
    if (error.message !== `"exp" claim timestamp check failed`) {
      console.error("JWT verification failed:", error.message);
    }
    return null;
  }
};

// Generate Refresh Token
export const generateRefreshToken = async (user: any): Promise<string> => {
  const jwtClaims = {
    sub: user,
    iss: issuerKey,
    jti: makeUuid(),
  };

  return new SignJWT(jwtClaims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_EXPIRY) // Adjust the '14d' to your `JWT_REFRESH_EXPIRY`
    .sign(new TextEncoder().encode(APP_REFRESH_TOKEN_SECRET));
};

// Verify Refresh Token
export const verifyRefreshToken = async (token: string): Promise<any> => {
  if (!token) {
    return null;
  }

  const cookieToken = token.includes(" ") ? token.split(" ")[1] : token;

  try {
    const { payload } = await jwtVerify(
      cookieToken,
      new TextEncoder().encode(APP_REFRESH_TOKEN_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
};

// Generate Reset Token
export const generateResetToken = async (user: any): Promise<string> => {
  const jwtClaims = {
    sub: user,
    iss: issuerKey,
    jti: makeUuid(),
  };

  return new SignJWT(jwtClaims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_RESET_EXPIRY) // Adjust the '1h' to your `JWT_RESET_EXPIRY`
    .sign(new TextEncoder().encode(APP_RESET_TOKEN_SECRET));
};

// Verify Reset Token
export const verifyResetToken = async (token: string): Promise<any> => {
  if (!token) {
    return null;
  }

  const cookieToken = token.includes(" ") ? token.split(" ")[1] : token;
  try {
    const { payload } = await jwtVerify(
      cookieToken,
      new TextEncoder().encode(APP_RESET_TOKEN_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("Reset Token verification failed:", error.message);
    return null;
  }
};

export const generateEmailToken = async (user: any): Promise<string> => {
  const jwtClaims = {
    sub: user,
    iss: issuerKey,
    jti: makeUuid(),
  };

  return new SignJWT(jwtClaims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // 24 hours for email token expiry
    .sign(new TextEncoder().encode(APP_RESET_TOKEN_SECRET)); // Using the same secret for email tokens for simplicity
};

// Generate CSRF Token
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Creates a new session for a user
export const createSession = async (
  userId: string,
  roleId: number,
  accessToken: string,
  csrfToken: string,
  refreshToken: string,
  ipAddress: string = ""
): Promise<{ sid: string; userId: string; roleId: number }> => {
  const redis = RedisSingleton.getInstance();
  const sessionId = makeUuid(); // Generate a unique session ID
  const userSessionKey = `sessionId:${sessionId}`;
  const sessionData = JSON.stringify({
    userId,
    roleId,
    sid: makeUuid(),
    accessToken,
    csrfToken,
    refreshToken,
    ipAddress,
  });
  // Assuming the session's expiration time is also 14 days (in seconds)
  const expirationTimeInSeconds = 60 * 60 * 24 * 14;
  await redis.set(userSessionKey, sessionData, "EX", expirationTimeInSeconds);

  return { sid: sessionId, userId, roleId };
};

// Delete a specific session for a user
export const deleteSession = async (sessionId: string): Promise<void> => {
  const redis = RedisSingleton.getInstance();
  const userSessionKey = `sessionId:${sessionId}`;
  await redis.del(userSessionKey);
};
