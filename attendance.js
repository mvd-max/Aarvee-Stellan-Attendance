const WEBAPP = "https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec";

let latitude = "";
let longitude = "";
let address = "";

// ==========================
// Get GPS + Address
// ==========================
function getLocation(callback) {

    if (!navigator.geolocation) {
        document.getElementById("location").innerHTML = "GPS Not Supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );

                const data = await response.json();

                address = data.display_name;

                document.getElementById("location").innerHTML = "📍 " + address;

            } catch {

                address = latitude + "," + longitude;

                document.getElementById("location").innerHTML =
                    "📍 Location Captured";

            }

            callback();

        },

        function() {

            document.getElementById("location").innerHTML =
                "Location Permission Denied";

        }

    );

}

// ==========================
// Punch In
// ==========================
async function punchIn() {

    const emp = document.getElementById("employee").value;

    if (emp === "") {
        alert("Please Select Employee");
        return;
    }

    const arr = emp.split("|");
    const employeeId = arr[0];
    const name = arr[1];

    getLocation(async function () {

        const response = await fetch(WEBAPP, {

            method: "POST",

            body: JSON.stringify({

                action: "punchin",
                employeeId: employeeId,
                name: name,
                address: address

            })

        });

        const result = await response.json();

        document.getElementById("msg").innerHTML =
            result.success ? "✅ Punch In Successful" : "❌ " + result.message;

    });

}

// ==========================
// Punch Out
// ==========================
async function punchOut() {

    const emp = document.getElementById("employee").value;

    if (emp === "") {
        alert("Please Select Employee");
        return;
    }

    const arr = emp.split("|");
    const employeeId = arr[0];

    const response = await fetch(WEBAPP, {

        method: "POST",

        body: JSON.stringify({

            action: "punchout",
            employeeId: employeeId

        })

    });

    const result = await response.json();

    document.getElementById("msg").innerHTML =
        result.success ? "✅ Punch Out Successful" : "❌ " + result.message;

}
