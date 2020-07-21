import express, { Request, Response, NextFunction } from "express"
import indexRouter from './routes/index'

var createError = require("http-errors");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.route("/");

app.use("/api", indexRouter);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error"); //改成 res.send
});

module.exports = app;
