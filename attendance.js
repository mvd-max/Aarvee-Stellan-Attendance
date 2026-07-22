const WEBAPP = "https://script.google.com/macros/s/AKfycbz-ffVMBmyW9HRxfzadHbo-7-RAhRmF-UXP_WE6QZ3qLDojYL2aeSUR0ulZoh4HZWMl/exec";

let latitude = "";
let longitude = "";
let gpsReady = false;

function getLocation(callback) {

    if (gpsReady) {
        callback();
        return;
    }

    if (!navigator.geolocation) {
        document.getElementById("location").innerHTML = "📍 GPS ઉપલબ્ધ નથી";
        return;
    }

    document.getElementById("location").innerHTML = "📍 સ્થાન મેળવી રહ્યા છીએ...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            gpsReady = true;

            document.getElementById("location").innerHTML = "📍 સ્થાન તૈયાર છે";

            callback();

        },

        function(error) {

            console.log(error);

            document.getElementById("location").innerHTML =
                "❌ Location મળી નથી";

            alert("Location મળી નથી. કૃપા કરીને GPS ON રાખો.");

        },

        {
            enableHighAccuracy: false,
            timeout:10000,
            maximumAge:600000
        }

    );
}

window.onload = function () {
    getLocation(function(){});
};

async function punchIn(){

    const btn=document.getElementById("inBtn");

    btn.disabled=true;
    btn.innerHTML="થોડી રાહ જુઓ...";

    const emp=document.getElementById("employee").value;

    if(emp==""){

        alert("કર્મચારી પસંદ કરો");

        btn.disabled=false;
        btn.innerHTML="🟢 આવ્યા";
        return;
    }

    const arr=emp.split("|");

    const sendData=async()=>{

        try{

            const response=await fetch(WEBAPP,{
                method:"POST",
                body:JSON.stringify({
                    action:"punchin",
                    employeeId:arr[0],
                    name:arr[1],
                    latitude:latitude,
                    longitude:longitude
                })
            });

            const result=await response.json();

            document.getElementById("msg").innerHTML=result.success
            ?"✅ હાજરી સફળતાપૂર્વક નોંધાઈ"
            :"❌ "+result.message;

        }catch(e){

            document.getElementById("msg").innerHTML="❌ Server સાથે સંપર્ક થઈ શક્યો નથી";

        }

        btn.disabled=false;
        btn.innerHTML="🟢 આવ્યા";
    };

    if(gpsReady){

        sendData();

    }else{

        getLocation(function(){

            sendData();

        });

        setTimeout(function(){

            if(!gpsReady){

                btn.disabled=false;
                btn.innerHTML="🟢 આવ્યા";

            }

        },11000);

    }

}

async function punchOut(){

    const btn=document.getElementById("outBtn");

    btn.disabled=true;
    btn.innerHTML="થોડી રાહ જુઓ...";

    const emp=document.getElementById("employee").value;

    if(emp==""){

        alert("કર્મચારી પસંદ કરો");

        btn.disabled=false;
        btn.innerHTML="🔴 ગયા";
        return;
    }

    const arr=emp.split("|");

    try{

        const response=await fetch(WEBAPP,{
            method:"POST",
            body:JSON.stringify({
                action:"punchout",
                employeeId:arr[0]
            })
        });

        const result=await response.json();

        document.getElementById("msg").innerHTML=result.success
        ?"✅ બહાર જવાની નોંધ થઈ ગઈ"
        :"❌ "+result.message;

    }catch(e){

        document.getElementById("msg").innerHTML="❌ Server સાથે સંપર્ક થઈ શક્યો નથી";

    }

    btn.disabled=false;
    btn.innerHTML="🔴 ગયા";
}
