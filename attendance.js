const WEBAPP = "https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec";

let latitude = "";
let longitude = "";
let address = "";

let stream = null;
let selfieImage = "";
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

                document.getElementById("location").innerHTML =
                    "📍 " + address;

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

    if (emp == "") {
        alert("Please Select Employee");
        return;
    }

    if (selfieImage == "") {
        alert("Please Capture Selfie First");
        return;
    }

    const arr = emp.split("|");
    const employeeId = arr[0];
    const name = arr[1];

    getLocation(async function () {

        let selfieUrl = "";

        // Upload Selfie
        const upload = await fetch(WEBAPP, {

            method: "POST",

            body: JSON.stringify({

                action: "uploadselfie",
                employeeId: employeeId,
                image: selfieImage

            })

        });

        const uploadResult = await upload.json();

        if (uploadResult.success) {
            selfieUrl = uploadResult.url;
        }

        // Punch In
        const response = await fetch(WEBAPP, {

            method: "POST",

            body: JSON.stringify({

                action: "punchin",
                employeeId: employeeId,
                name: name,
                address: address,
                selfieUrl: selfieUrl

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

    if (emp == "") {
        alert("Please Select Employee");
        return;
    }

    const arr = emp.split("|");
    const employeeId = arr[0];
    const name = arr[1];

    const response = await fetch(WEBAPP, {

        method: "POST",

        body: JSON.stringify({

            action: "punchout",
            employeeId: employeeId,
            name: name

        })

    });

    const result = await response.json();

    document.getElementById("msg").innerHTML =
        result.success ? "✅ Punch Out Successful" : "❌ " + result.message;

}


// ==========================
// Open Camera
// ==========================
async function openCamera() {

    stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });

    const video = document.getElementById("video");

    video.srcObject = stream;
    video.style.display = "block";
}


// ==========================
// Capture Photo
// ==========================
function capturePhoto() {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    selfieImage = canvas.toDataURL("image/jpeg").split(",")[1];

    preview.src = "data:image/jpeg;base64," + selfieImage;
    preview.style.display = "block";

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    video.style.display = "none";
}
