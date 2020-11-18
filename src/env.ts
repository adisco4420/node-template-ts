const dotenv = require('dotenv');
dotenv.config()

const env = {
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY,
}
export default env;