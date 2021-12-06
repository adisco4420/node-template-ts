const dotenv = require('dotenv');
dotenv.config()

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,
    NODE_ENV: process.env.NODE_ENV
}
export default env;