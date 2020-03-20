var createError = require("http-errors");
var express = require("express");
var path = require("path");
var indexRouter = require("./routes/index");

var app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.route("/", {});

app.use("/api", indexRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error"); //改成 res.send
});

module.exports = app;
