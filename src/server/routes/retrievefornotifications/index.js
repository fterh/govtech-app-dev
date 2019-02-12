const config = require("./../../../../config");
const post = require("./post");

function retrievefornotifications(req, res) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;

    default:
      res
        .status(405)
        .set("Allow", "POST")
        .send({
            "message": config.constants.INVALID_REQUEST_MESSAGE
        });
  }
}

module.exports = retrievefornotifications;
