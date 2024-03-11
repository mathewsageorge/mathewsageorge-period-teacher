const $status = document.getElementById("status");
const $log = document.getElementById("log");
const $teacher = document.getElementById("teacher");
const $period = document.getElementById("period");
const $checkIn = document.getElementById("check-in");

const currentTime = () => {
    return new Date().toString().slice(0, -31);
};

let currentStatus = "in"; // Set default status to "in"

const handleNewRecord = async (serialNumber, logData, time, teacher, period) => {
    try {
        await fetch('https://mathewsageorge-period-teacher.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serialNumber,
                logData,
                time,
                teacher,
                period,
                status: currentStatus,
            }),
        });

        // Update the DOM to display the received data
        const $record = document.createElement("div");
        $record.innerHTML = `\n${serialNumber} - <b>${logData}</b> - ${time} - Teacher: ${teacher} - Period: ${period}`;
        $log.appendChild($record);

        // Update message
        $status.innerHTML = `<h4>Last Read</h4>${serialNumber}<br>${currentTime()}`;
    } catch (error) {
        console.error('Failed to save record on the server:', error);
        alert('Failed to save record on the server.');
    }
};

if (!window.NDEFReader) {
    $status.innerHTML = "<h4>NFC Unsupported!</h4>";
}

const activateNFC = () => {
    const ndef = new NDEFReader();

    ndef.scan()
        .then(() => {
            $status.innerHTML = "<h4>Bring an NFC tag towards the back of your phone...</h4>";
        })
        .catch((err) => {
            console.log("Scan Error:", err);
            alert(err);
        });

    ndef.onreadingerror = (e) => {
        $status.innerHTML = "<h4>Read Error</h4>" + currentTime();
        console.log(e);
    };

    ndef.onreading = async(e) => {
        const time = currentTime();
        const { serialNumber } = e;
        const teacher = $teacher.value; // Retrieve selected teacher's name
        const period = $period.value; // Retrieve selected period
        $status.innerHTML = `<h4>Last Read</h4>${serialNumber}<br>${currentTime()}`;
        await handleNewRecord(serialNumber, currentStatus, time, teacher, period);
        console.log(e);
    };
};

document.getElementById("start-btn").onclick = (e) => {
    activateNFC();
};

$checkIn.onchange = () => {
    currentStatus = $checkIn.checked ? "in" : "out";
};
