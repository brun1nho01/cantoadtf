import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: true, message: 'Too many requests from this IP, please try again later.' },
});

export const bakingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: { error: true, message: 'Rate limit exceeded for Baking. Please wait a minute.' },
});
