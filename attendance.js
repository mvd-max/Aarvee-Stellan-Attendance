const WEBAPP = "https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec";

let latitude = "";
let longitude = "";

// Website ખુલે ત્યારે એક વખત GPS લો
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            document.getElementById("location").innerHTML = "📍 GPS Ready";
        }, function () {
            document.getElementById("location").innerHTML = "Location Permission Denied";
        }, {
            enableHighAccuracy: false,
            timeout: 2000,
            maximumAge: 300000
        });
    }
};

async function punchIn() {

    const emp = document.getElementById("employee").value;

    if (emp === "") {
        alert("Please Select Employee");
        return;
    }

    const arr = emp.split("|");

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
        result.success ? "✅ Punch In Successful" : "❌ " + result.message;
}

async function punchOut() {

    const emp = document.getElementById("employee").value;

    if (emp === "") {
        alert("Please Select Employee");
        return;
    }

    const arr = emp.split("|");

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
        result.success ? "✅ Punch Out Successful" : "❌ " + result.message;
}
