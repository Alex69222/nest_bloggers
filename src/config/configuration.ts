export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  database: {
    MONGOOSE_URI: process.env.MONGOOSE_URI,
  },
});
