-- ===========================================
-- Meeting Room Booking System
-- Database
-- ===========================================

DROP DATABASE IF EXISTS meeting_room;

CREATE DATABASE meeting_room
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE meeting_room;

-- ===========================================
-- Table : bookings
-- ===========================================

CREATE TABLE bookings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    room_name VARCHAR(100) NOT NULL,

    topic VARCHAR(255) NOT NULL,

    booker VARCHAR(100) NOT NULL,

    department VARCHAR(100) NOT NULL,

    meeting_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    participants INT NOT NULL,

    status VARCHAR(50) DEFAULT 'จองแล้ว',

    ai_message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ===========================================
-- Sample Data
-- ===========================================

INSERT INTO bookings
(
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

VALUES

(
'Meeting Room A',
'ประชุมทีม IT',
'วัชรดุล แก้วฉบับ',
'IT',
'2026-07-10',
'09:00:00',
'10:00:00',
8,
'จองแล้ว',
'🤖 AI : จองห้องประชุมเรียบร้อย'
),

(
'Meeting Room B',
'ประชุมฝ่ายขาย',
'สมชาย ใจดี',
'Sales',
'2026-07-10',
'13:00:00',
'14:30:00',
12,
'จองแล้ว',
'🤖 AI : ห้องประชุมพร้อมใช้งาน'
),

(
'Board Room',
'ประชุมผู้บริหาร',
'ผู้จัดการ',
'Management',
'2026-07-11',
'10:00:00',
'12:00:00',
15,
'กำลังประชุม',
'🤖 AI : ห้องประชุมกำลังถูกใช้งาน'
);

-- ===========================================
-- Dashboard Summary
-- ===========================================

CREATE VIEW dashboard_summary AS

SELECT

COUNT(*) total_booking,

SUM(status='จองแล้ว') booking,

SUM(status='กำลังประชุม') meeting,

SUM(status='ยกเลิก') cancel

FROM bookings;

-- ===========================================
-- Useful Query
-- ===========================================

SELECT * FROM bookings;

SELECT * FROM dashboard_summary;

SELECT * FROM bookings
ORDER BY meeting_date,start_time;

SELECT COUNT(*) AS total
FROM bookings;

SELECT COUNT(*) AS today_booking
FROM bookings
WHERE meeting_date=CURDATE();

SELECT COUNT(*) AS meeting_now
FROM bookings
WHERE status='กำลังประชุม';

SELECT COUNT(*) AS cancel_booking
FROM bookings
WHERE status='ยกเลิก';

SELECT room_name,
meeting_date,
start_time,
end_time
FROM bookings
ORDER BY meeting_date,start_time;