// ======================================
// Meeting Room Booking System
// script.js (Part 1)
// ======================================
let editingId = null;
// Dashboard
async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

        const data = await response.json();

        document.getElementById("totalBooking").innerText =
            data.total_booking || 0;

        document.getElementById("bookingCount").innerText =
            data.booking || 0;

        document.getElementById("meetingCount").innerText =
            data.meeting || 0;

        document.getElementById("cancelCount").innerText =
            data.cancel_booking || 0;

    } catch (err) {

        console.error(err);

    }

}

// ======================================
// Load Booking
// ======================================

async function loadBookings() {

    try {

        const response = await fetch("/api/bookings");

        const bookings = await response.json();

        const table =
            document.getElementById("bookingTable");

        let html = "";

        bookings.forEach((item) => {

            html += `

            <tr>

                <td>${item.id}</td>

                <td>${item.room_name}</td>

                <td>${item.topic}</td>

                <td>${item.booker}</td>

                <td>${item.department}</td>

                <td>${formatDate(item.meeting_date)}</td>

                <td>

                    ${item.start_time}

                    -

                    ${item.end_time}

                </td>

                <td>

                    ${item.participants}

                </td>

                <td>

                    ${statusBadge(item.status)}

                </td>

                <td>

                    ${item.ai_message}

                </td>

                <td>

                    <button

                        class="btn btn-warning btn-sm"

                        onclick="location.href='edit.html?id=${item.id}'">

                        ✏️ 

                    </button>

                    <button

                        class="btn btn-danger btn-sm"

                        onclick="deleteBooking(${item.id})">

                        🗑️

                    </button>

                </td>

            </tr>

            `;

        });

        table.innerHTML = html;

    } catch (err) {

        console.error(err);

    }

}

// ======================================
// Badge
// ======================================

function statusBadge(status) {

    switch (status) {

        case "จองแล้ว":

            return `<span class="badge bg-success">จองแล้ว</span>`;

        case "กำลังประชุม":

            return `<span class="badge bg-primary">กำลังประชุม</span>`;

        case "ยกเลิก":

            return `<span class="badge bg-danger">ยกเลิก</span>`;

        case "เสร็จสิ้น":

            return `<span class="badge bg-secondary">เสร็จสิ้น</span>`;
            case "ใกล้ถึงเวลา":

    return `<span class="badge bg-warning text-dark">
    🟠 ใกล้ถึงเวลา
    </span>`;

        default:

            return `<span class="badge bg-dark">${status}</span>`;

    }

}
// ======================================
// Save Booking
// ======================================

async function saveBooking() {

    const room_name =
        document.getElementById("room_name").value;

    const topic =
        document.getElementById("topic").value;

    const booker =
        document.getElementById("booker").value;

    const department =
        document.getElementById("department").value;

    const meeting_date =
        document.getElementById("meeting_date").value;

    const start_time =
        document.getElementById("start_time").value;

    const end_time =
        document.getElementById("end_time").value;

    const participants =
        document.getElementById("participants").value;

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

    // ======================================
    // AI Check Room
    // ======================================

    const check = await fetch(

        `/api/check-room?room_name=${encodeURIComponent(room_name)}&meeting_date=${meeting_date}&start_time=${start_time}&end_time=${end_time}`

    );

    const checkResult = await check.json();

    document.getElementById("ai_message").value =
        checkResult.ai_message;

    if (!checkResult.available) {

        alert(checkResult.ai_message);

        return;

    }

    // ======================================
    // Save Booking
    // ======================================

    const response = await fetch("/api/bookings", {

        method: "POST",

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

            participants

        })

    });

    const result = await response.json();

    document.getElementById("ai_message").value =
        result.ai_message;

    alert(result.ai_message);

    clearForm();

    loadDashboard();

    loadBookings();

}

// ======================================
// Clear Form
// ======================================

function clearForm() {

    document.getElementById("room_name").value = "";

    document.getElementById("topic").value = "";

    document.getElementById("booker").value = "";

    document.getElementById("department").value = "";

    document.getElementById("meeting_date").value = "";

    document.getElementById("start_time").value = "";

    document.getElementById("end_time").value = "";

    document.getElementById("participants").value = 1;

    document.getElementById("ai_message").value =
        "🤖 AI พร้อมให้บริการ";

}
// ======================================
// Edit Booking
// ======================================

async function editBooking(id){

    const response=await fetch(`/api/bookings/${id}`);

    const booking=await response.json();

    editingId=id;

    document.getElementById("room_name").value=booking.room_name;

    document.getElementById("topic").value=booking.topic;

    document.getElementById("booker").value=booking.booker;

    document.getElementById("department").value=booking.department;

    document.getElementById("meeting_date").value=
    booking.meeting_date.split("T")[0];

    document.getElementById("start_time").value=
    booking.start_time.substring(0,5);

    document.getElementById("end_time").value=
    booking.end_time.substring(0,5);

    document.getElementById("participants").value=
    booking.participants;

    document.getElementById("ai_message").value=
    "🤖 AI : กำลังแก้ไขรายการ";

    document.querySelector("#saveBtn").innerHTML="💾 บันทึกการแก้ไข";

}

// ======================================
// Delete Booking
// ======================================

async function deleteBooking(id) {

    const confirmDelete = confirm("ต้องการลบรายการนี้ใช่หรือไม่ ?");

    if (!confirmDelete) {

        return;

    }

    try {

        await fetch(`/api/bookings/${id}`, {

            method: "DELETE"

        });

        alert("ลบข้อมูลเรียบร้อย");

        loadDashboard();

        loadBookings();

    } catch (err) {

        console.error(err);

    }

}

// ======================================
// Auto Refresh
// ======================================

setInterval(() => {

    loadDashboard();

    loadBookings();

}, 30000);

// ======================================
// Window Load
// ======================================

window.onload = () => {

    loadDashboard();

    loadBookings();

    document.getElementById("ai_message").value =
        "🤖 AI พร้อมให้บริการจองห้องประชุม";

};

function formatDate(date){

    const d = new Date(date);

    return d.toLocaleDateString("th-TH",{

        year:"numeric",

        month:"2-digit",

        day:"2-digit"

    });

}
// ======================================
// End Script
// ======================================