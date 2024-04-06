const _config = {
  mongoDb: process.env.MONGODB_URI,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};

const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.error(
        `The ${key} variable not found, Make Sure pass env variables`
      );
      process.exit();
    }
    return value;
  },
};

module.exports = config;
