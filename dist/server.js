"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_ts_1 = require("./app.ts");
app_ts_1.server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
    console.log("HTTP server runing!");
});
