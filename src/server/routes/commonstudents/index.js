const config = require("./../../../../config");
const get = require("./get");

function commonstudents(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;

    default:
      res
        .status(405)
        .set("Allow", "GET")
        .send({
            "message": config.constants.INVALID_REQUEST_MESSAGE
        });
  }
}

module.exports = commonstudents;
