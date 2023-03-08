export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  hashSalt: parseInt(process.env.HASH_SALT) || 13,
  jwtSecret: process.env.JWT_SECRET || '666',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  database: {
    MONGOOSE_URI: process.env.MONGOOSE_URI,
  },
  smtp: {
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
});
