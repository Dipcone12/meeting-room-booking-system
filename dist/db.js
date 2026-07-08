"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// =======================================
// MySQL Connection
// =======================================
const db = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "meeting_room",
    port: 3306
});
// =======================================
// Connect Database
// =======================================
db.connect((err) => {
    if (err) {
        console.log("====================================");
        console.log("❌ Database Connection Failed");
        console.log(err);
        console.log("====================================");
        return;
    }
    console.log("====================================");
    console.log("✅ MySQL Connected");
    console.log("📂 Database : meeting_room");
    console.log("====================================");
});
// =======================================
exports.default = db;
