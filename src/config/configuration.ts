export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  hashSalt: parseInt(process.env.HASH_SALT) || 13,
  database: {
    MONGOOSE_URI: process.env.MONGOOSE_URI,
  },
});
