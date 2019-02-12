require("dotenv").config();

const env = process.env.NODE_ENV || "development"; // Default to "development"
process.env.NODE_ENV = env;

const config = {
    database: {
        host: process.env.DB_HOST || "localhost",
        name: process.env.DB_NAME ||
            (env === "development" ? "db_dev" :
            (env === "test" ? "db_test" : "db_prod"))
    },
    server: {
        port: process.env.PORT || 3000
    },
    constants: {
        INVALID_REQUEST_MESSAGE: "Oops, there's nothing here."
    }
};

module.exports = config;
