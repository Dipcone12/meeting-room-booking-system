import mysql from "mysql2";

// =======================================
// MySQL Connection
// =======================================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "meeting_room",

    port: 3306

});

// =======================================
// Connect Database
// =======================================

db.connect((err: mysql.QueryError | null) => {

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

export default db;