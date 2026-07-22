const WEBAPP = "https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec";

let latitude = "";
let longitude = "";

// ==========================
// GPS
// ==========================
function getLocation(callback) {

    if (!navigator.geolocation) {
        document.getElementById("location").innerHTML = "📍 GPS ઉપલબ્ધ નથી";
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            document.getElementById("location").innerHTML = "📍 સ્થાન તૈયાર છે";
            callback();

        },

        function(error) {

            alert("📍 કૃપા કરીને Location ચાલુ કરો");
            console.log(error);

        },

        {
            enableHighAccuracy: false,
            timeout: 2000,
            maximumAge: 300000
        }

    );

}

// ==========================
// આવ્યા (Punch In)
// ==========================
async function punchIn() {

    const btn = document.getElementById("inBtn");
    btn.disabled = true;
    btn.innerHTML = "થોડી રાહ જુઓ...";

    const emp = document.getElementById("employee").value;

    if (emp == "") {
        alert("કૃપા કરીને કર્મચારી પસંદ કરો");
        btn.disabled = false;
        btn.innerHTML = "🟢 આવ્યા";
        return;
    }

    const arr = emp.split("|");

    getLocation(async function () {

        try {

            const response = await fetch(WEBAPP, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    action: "punchin",
                    employeeId: arr[0],
                    name: arr[1],
                    latitude: latitude,
                    longitude: longitude

                })

            });

            const result = await response.json();

            document.getElementById("msg").innerHTML =
                result.success
                ? "✅ હાજરી સફળતાપૂર્વક નોંધાઈ"
                : "❌ " + result.message;

        } catch (e) {

            document.getElementById("msg").innerHTML = "❌ સર્વર સાથે સંપર્ક થઈ શક્યો નથી";

        }

        btn.disabled = false;
        btn.innerHTML = "🟢 આવ્યા";

    });

}

// ==========================
// ગયા (Punch Out)
// ==========================
async function punchOut() {

    const btn = document.getElementById("outBtn");
    btn.disabled = true;
    btn.innerHTML = "થોડી રાહ જુઓ...";

    const emp = document.getElementById("employee").value;

    if (emp == "") {
        alert("કૃપા કરીને કર્મચારી પસંદ કરો");
        btn.disabled = false;
        btn.innerHTML = "🔴 ગયા";
        return;
    }

    const arr = emp.split("|");

    try {

        const response = await fetch(WEBAPP, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                action: "punchout",
                employeeId: arr[0]

            })

        });

        const result = await response.json();

        document.getElementById("msg").innerHTML =
            result.success
            ? "✅ બહાર જવાની નોંધ થઈ ગઈ"
            : "❌ " + result.message;

    } catch (e) {

        document.getElementById("msg").innerHTML = "❌ સર્વર સાથે સંપર્ક થઈ શક્યો નથી";

    }

    btn.disabled = false;
    btn.innerHTML = "🔴 ગયા";

}
