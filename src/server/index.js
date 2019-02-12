const app = require("express")();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const config = require("./../../config");

const register = require("./routes/register");
const commonstudents = require("./routes/commonstudents");
const suspend = require("./routes/suspend");
const retrievefornotifications = require("./routes/retrievefornotifications");

const { port } = config.server;

app.use(helmet());
app.use(bodyParser.json());

app.all("/api/register", register);
app.all("/api/commonstudents", commonstudents);
app.all("/api/suspend", suspend);
app.all("/api/retrievefornotifications", retrievefornotifications);

// Return 404 for everything else.
app.all(/\/.*/, (req, res) => {
  res.status(404).send({
      "message": config.constants.INVALID_REQUEST_MESSAGE
  });
});

function start() {
  app.listen(port);
  console.log("Server is running");
}

module.exports = {
  app,
  start
};
