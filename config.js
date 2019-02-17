require("dotenv").config();

const env = process.env.NODE_ENV || "development"; // Default to "development"
process.env.NODE_ENV = env;

const config = {
    database: {
        name: process.env.DB_NAME ||
            (env === "development" ? "main.db" :
            (env === "test" ? "test.db" : "main.db"))
    },
    server: {
        port: process.env.PORT || 3000
    },
    constants: {
        INVALID_REQUEST_MESSAGE: "Oops, there's nothing here.",
        INVALID_REQUEST_BODY: "Your request body is invalid."
    }
};

module.exports = config;
