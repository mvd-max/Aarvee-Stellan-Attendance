async function login() {

    const employeeId = document.getElementById("employeeId").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (employeeId === "" || password === "") {
        message.innerHTML = "Please enter all details";
        return;
    }

    message.innerHTML = "Checking...";

    try {

        const response = await fetch("https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec", {
            method: "POST",
            body: JSON.stringify({
                action: "login",        // ⭐ આ નવી line ઉમેરવી
                employeeId: employeeId,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {

            localStorage.setItem("employeeName", result.name);
            localStorage.setItem("employeeId", result.employeeId);

            message.innerHTML = "Welcome " + result.name;

            window.location.href = "attendance.html";

        } else {

            message.innerHTML = result.message;

        }

    } catch (e) {

        console.log(e);
        message.innerHTML = "Server Error";

    }

}
