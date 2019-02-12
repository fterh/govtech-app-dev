const post = require("./post");

function article(req, res) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;

    default:
      res
        .status(405)
        .set("Allow", "POST")
        .send({
            "message": "Method not allowed."
        });
  }
}

module.exports = article;
