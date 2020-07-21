"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var createError = require("http-errors");
var path = require("path");
var app = express_1.default();
app.use(express_1.default.static(path.join(__dirname, "client/build")));
app.route("/");
app.use("/api", index_1.default);
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send("error"); //改成 res.send
});
module.exports = app;
