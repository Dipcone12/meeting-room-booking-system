import express, {
    Request,
    Response
} from "express";

import path from "path";

import db from "./db";

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);

// =====================
// Home
// =====================

app.get(
    "/",
    (
        req: Request,
        res: Response
    ) => {

       res.sendFile(
    path.join(
        __dirname,
        "..",
        "public",
        "index.html"
    )
);
res.sendFile(
    path.join(
        __dirname,
        "..",
        "public",
        "edit.html"
    )
);
    }
);

// =====================
// Dashboard
// =====================

app.get(
    "/api/dashboard",
    (
        req: Request,
        res: Response
    ) => {

        const sql = `

        SELECT

        COUNT(*) total_booking,

        SUM(
            status='จองแล้ว'
        ) booking,

        SUM(
            status='กำลังประชุม'
        ) meeting,

        SUM(
            status='ใกล้ถึงเวลา'
        ) coming,

        SUM(
            status='ยกเลิก'
        ) cancel_booking,

        SUM(
            status='เสร็จสิ้น'
        ) completed

        FROM bookings

        `;

        db.query(

            sql,

            (
                err,
                result: any
            ) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                res.json(
                    result[0]
                );

            }

        );

    }
);

// =====================
// Get All Booking
// =====================

app.get(
    "/api/bookings",
    (
        req: Request,
        res: Response
    ) => {

        const sql = `

        SELECT

        *

        FROM bookings

        ORDER BY

        meeting_date,

        start_time

        `;

        db.query(

            sql,

            (
                err,
                result: any
            ) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                res.json(
                    result
                );

            }

        );

    }
);

// =====================
// Get Booking By ID
// =====================

app.get(
    "/api/bookings/:id",
    (
        req: Request,
        res: Response
    ) => {

        db.query(

            "SELECT * FROM bookings WHERE id=?",

            [
                req.params.id
            ],

            (
                err,
                result: any
            ) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                res.json(
                    result[0]
                );

            }

        );

    }
);
// =====================
// Create Booking
// =====================

app.post(
    "/api/bookings",
    (
        req: Request,
        res: Response
    ) => {

        const {

            room_name,
            topic,
            booker,
            department,
            meeting_date,
            start_time,
            end_time,
            participants

        } = req.body;

        const checkSQL = `

        SELECT *

        FROM bookings

        WHERE room_name = ?

        AND meeting_date = ?

        AND (

            (? BETWEEN start_time AND end_time)

            OR

            (? BETWEEN start_time AND end_time)

            OR

            (start_time BETWEEN ? AND ?)

        )

        `;

        db.query(

            checkSQL,

            [

                room_name,

                meeting_date,

                start_time,

                end_time,

                start_time,

                end_time

            ],

            (
                err,
                result: any
            ) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                if (result.length > 0) {

                    return res.json({

                        success: false,

                        ai_message:
                        "🤖 AI : ห้องประชุมนี้ถูกจองแล้ว"

                    });

                }

                const status =
                    "จองแล้ว";

                const ai_message =
                    "🤖 AI : จองห้องประชุมเรียบร้อย";

                const insertSQL = `

                INSERT INTO bookings(

                    room_name,
                    topic,
                    booker,
                    department,
                    meeting_date,
                    start_time,
                    end_time,
                    participants,
                    status,
                    ai_message

                )

                VALUES(

                    ?,?,?,?,?,?,?,?,?,?

                )

                `;

                db.query(

                    insertSQL,

                    [

                        room_name,

                        topic,

                        booker,

                        department,

                        meeting_date,

                        start_time,

                        end_time,

                        participants,

                        status,

                        ai_message

                    ],

                    (err2) => {

                        if (err2) {

                            return res
                                .status(500)
                                .json(err2);

                        }

                        res.json({

                            success: true,

                            status,

                            ai_message

                        });

                    }

                );

            }

        );

    }
);

// =====================
// Check Room
// =====================

app.get(
    "/api/check-room",
    (
        req: Request,
        res: Response
    ) => {

        const {

            room_name,

            meeting_date,

            start_time,

            end_time

        } = req.query;

        const sql = `

        SELECT *

        FROM bookings

        WHERE room_name=?

        AND meeting_date=?

        AND(

            (? BETWEEN start_time AND end_time)

            OR

            (? BETWEEN start_time AND end_time)

            OR

            (start_time BETWEEN ? AND ?)

        )

        `;

        db.query(

            sql,

            [

                room_name,

                meeting_date,

                start_time,

                end_time,

                start_time,

                end_time

            ],

            (
                err,
                result: any
            ) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                if (result.length > 0) {

                    return res.json({

                        available: false,

                        ai_message:
                        "🤖 AI : ห้องประชุมไม่ว่าง"

                    });

                }

                res.json({

                    available: true,

                    ai_message:
                    "🤖 AI : ห้องพร้อมใช้งาน"

                });

            }

        );

    }
);
// =====================
// Update Booking
// =====================

app.put(
    "/api/bookings/:id",
    (
        req: Request,
        res: Response
    ) => {

        const id =
            req.params.id;

        const {

            room_name,
            topic,
            booker,
            department,
            meeting_date,
            start_time,
            end_time,
            participants,
            status

        } = req.body;

        let ai_message =
            "🤖 AI : บันทึกข้อมูลเรียบร้อย";

        switch (status) {

            case "จองแล้ว":

                ai_message =
                    "🤖 AI : อัปเดตการจองเรียบร้อย";

                break;

            case "ใกล้ถึงเวลา":

                ai_message =
                    "🤖 AI : เหลือเวลาอีก 15 นาที ก่อนเริ่มประชุม";

                break;

            case "กำลังประชุม":

                ai_message =
                    "🤖 AI : ห้องประชุมกำลังถูกใช้งาน";

                break;

            case "เสร็จสิ้น":

                ai_message =
                    "🤖 AI : การประชุมเสร็จสิ้น";

                break;

            case "ยกเลิก":

                ai_message =
                    "🤖 AI : ยกเลิกการจองเรียบร้อย";

                break;

        }

        const sql = `

        UPDATE bookings

        SET

        room_name=?,
        topic=?,
        booker=?,
        department=?,
        meeting_date=?,
        start_time=?,
        end_time=?,
        participants=?,
        status=?,
        ai_message=?

        WHERE id=?

        `;

        db.query(

            sql,

            [

                room_name,
                topic,
                booker,
                department,
                meeting_date,
                start_time,
                end_time,
                participants,
                status,
                ai_message,
                id

            ],

            (err) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                res.json({

                    success: true,

                    ai_message

                });

            }

        );

    }
);

// =====================
// Delete Booking
// =====================

app.delete(
    "/api/bookings/:id",
    (
        req: Request,
        res: Response
    ) => {

        db.query(

            "DELETE FROM bookings WHERE id=?",

            [

                req.params.id

            ],

            (err) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }

                res.json({

                    success: true,

                    message:
                    "ลบข้อมูลเรียบร้อย"

                });

            }

        );

    }
);

// =====================
// Edit Page
// =====================

app.get(
    "/edit/:id",
    (
        req: Request,
        res: Response
    ) => {

        res.sendFile(

            path.join(

                __dirname,

                "public",

                "edit.html"

            )

        );

    }
);
// =====================
// AI Auto Status
// =====================

setInterval(() => {

    const sql = `

    UPDATE bookings

    SET

    status = CASE

        WHEN NOW() >= DATE_SUB(
            CONCAT(meeting_date,' ',start_time),
            INTERVAL 15 MINUTE
        )

        AND NOW() < CONCAT(
            meeting_date,' ',start_time
        )

        THEN 'ใกล้ถึงเวลา'

        WHEN NOW() BETWEEN

            CONCAT(
                meeting_date,' ',start_time
            )

        AND

            CONCAT(
                meeting_date,' ',end_time
            )

        THEN 'กำลังประชุม'

        WHEN NOW() >

            CONCAT(
                meeting_date,' ',end_time
            )

        THEN 'เสร็จสิ้น'

        ELSE status

    END,

    ai_message = CASE

        WHEN NOW() >= DATE_SUB(
            CONCAT(meeting_date,' ',start_time),
            INTERVAL 15 MINUTE
        )

        AND NOW() < CONCAT(
            meeting_date,' ',start_time
        )

        THEN
        '🤖 AI : เหลือเวลาอีก 15 นาที ก่อนเริ่มประชุม'

        WHEN NOW() BETWEEN

            CONCAT(
                meeting_date,' ',start_time
            )

        AND

            CONCAT(
                meeting_date,' ',end_time
            )

        THEN
        '🤖 AI : การประชุมเริ่มแล้ว'

        WHEN NOW() >

            CONCAT(
                meeting_date,' ',end_time
            )

        THEN
        '🤖 AI : การประชุมเสร็จสิ้นแล้ว ห้องพร้อมใช้งาน'

        ELSE ai_message

    END

    `;

    db.query(sql, (err) => {

        if (err) {

            console.log(err);

            return;

        }

        console.log("🤖 AI Status Updated");

    });

}, 60000);

// =====================
// Server Start
// =====================

const PORT = 3000;

app.listen(PORT, () => {

    console.log("====================================");

    console.log("🏢 Meeting Room Booking System");

    console.log("");

    console.log(
        `🚀 Server Running : http://localhost:${PORT}`
    );

    console.log("");

    console.log("📅 Booking API Ready");

    console.log("🤖 AI Booking Ready");

    console.log("📊 Dashboard Ready");

    console.log("====================================");

});