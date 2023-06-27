const express = require("express");
const request = require("request");

const app = express();
const port = process.env.PORT || 3000;

app.use("/", (req, res) => {
  const url = "http://localhost:8000";

  request(url, (err, response, body) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error occured");
    }

    const injectedBody = body.replace(
      "</head>",
      "<script>alert(123)</script></head>"
    );
    res.send(injectedBody);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
