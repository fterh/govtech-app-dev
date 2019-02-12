const app = require("express")();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const config = require("./../../config");

const register = require("./routes/register");
const commonstudents = require("./routes/commonstudents");

const { port } = config.server;

app.use(helmet());
app.use(bodyParser.json());

app.all("/api/register", register);
app.app("/api/commonstudents", commonstudents);

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
