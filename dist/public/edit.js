// ======================================
// Meeting Room Booking System
// edit.js (Part 1)
// ======================================

// อ่าน id จาก URL
const params = new URLSearchParams(window.location.search);

const bookingId = params.get("id");

// ======================================
// โหลดข้อมูลการจอง
// ======================================

async function loadBooking() {

    if (!bookingId) {

        alert("ไม่พบรหัสการจอง");

        window.location.href = "/";

        return;

    }

    try {

        const response = await fetch(`/api/bookings/${bookingId}`);

        const booking = await response.json();

        document.getElementById("booking_id").value =
            booking.id;

        document.getElementById("room_name").value =
            booking.room_name;

        document.getElementById("topic").value =
            booking.topic;

        document.getElementById("booker").value =
            booking.booker;

        document.getElementById("department").value =
            booking.department;

        // yyyy-mm-dd
        document.getElementById("meeting_date").value =
            booking.meeting_date.split("T")[0];

        // HH:mm:ss → HH:mm
        document.getElementById("start_time").value =
            booking.start_time.substring(0,5);

        document.getElementById("end_time").value =
            booking.end_time.substring(0,5);

        document.getElementById("participants").value =
            booking.participants;

        document.getElementById("status").value =
            booking.status;

        document.getElementById("ai_message").value =
            booking.ai_message ||
            "🤖 AI : พร้อมแก้ไขข้อมูล";

    }

    catch(err){

        console.error(err);

        alert("ไม่สามารถโหลดข้อมูลได้");

    }

}
// ======================================
// Update Booking
// ======================================

async function updateBooking() {

    const room_name =
        document.getElementById("room_name").value.trim();

    const topic =
        document.getElementById("topic").value.trim();

    const booker =
        document.getElementById("booker").value.trim();

    const department =
        document.getElementById("department").value.trim();

    const meeting_date =
        document.getElementById("meeting_date").value;

    const start_time =
        document.getElementById("start_time").value;

    const end_time =
        document.getElementById("end_time").value;

    const participants =
        document.getElementById("participants").value;

    const status =
        document.getElementById("status").value;

    if (

        room_name === "" ||

        topic === "" ||

        booker === "" ||

        department === "" ||

        meeting_date === "" ||

        start_time === "" ||

        end_time === ""

    ) {

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;

    }

    let ai_message = "";

    switch (status) {

        case "จองแล้ว":

            ai_message =
                "🤖 AI : แก้ไขข้อมูลการจองเรียบร้อยแล้วครับ";

            break;

        case "กำลังประชุม":

            ai_message =
                "🤖 AI : ห้องประชุมกำลังถูกใช้งาน";

            break;

        case "เสร็จสิ้น":

            ai_message =
                "🤖 AI : การประชุมเสร็จสิ้นเรียบร้อย";

            break;

        case "ยกเลิก":

            ai_message =
                "🤖 AI : ยกเลิกการจองเรียบร้อย";

            break;

        default:

            ai_message =
                "🤖 AI : บันทึกข้อมูลเรียบร้อย";

            break;

    }

    document.getElementById("ai_message").value =
        ai_message;

    try {

        const response = await fetch(

            `/api/bookings/${bookingId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    room_name,

                    topic,

                    booker,

                    department,

                    meeting_date,

                    start_time,

                    end_time,

                    participants,

                    status

                })

            }

        );

        const result = await response.json();

        if (!result.success) {

            alert("ไม่สามารถบันทึกข้อมูลได้");

            return;

        }

        alert(result.ai_message);

        window.location.href = "/";

    }

    catch (err) {

        console.error(err);

        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");

    }

}

// ======================================
// Window Load
// ======================================

window.onload = () => {

    loadBooking();

};

// ======================================
// End edit.js
// ======================================