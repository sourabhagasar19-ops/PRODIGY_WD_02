/* =====================================
   STOPWATCH VARIABLES
===================================== */

let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let isRunning = false;

let laps = [];

let previousLapTime = 0;


/* =====================================
   GET HTML ELEMENTS
===================================== */

const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const lapsList = document.getElementById("lapsList");
const lapCount = document.getElementById("lapCount");

const statusText = document.getElementById("statusText");
const status = document.querySelector(".status");


/* =====================================
   FORMAT TIME
===================================== */

function formatTime(time) {

    let hours = Math.floor(time / 3600000);

    let minutes =
        Math.floor((time % 3600000) / 60000);

    let seconds =
        Math.floor((time % 60000) / 1000);

    let milliseconds =
        Math.floor((time % 1000) / 10);


    hours = String(hours).padStart(2, "0");

    minutes = String(minutes).padStart(2, "0");

    seconds = String(seconds).padStart(2, "0");

    milliseconds =
        String(milliseconds).padStart(2, "0");


    return `
        ${hours}:${minutes}:${seconds}
        <small>.${milliseconds}</small>
    `;
}


/* =====================================
   UPDATE DISPLAY
===================================== */

function updateDisplay() {

    elapsedTime =
        Date.now() - startTime;

    display.innerHTML =
        formatTime(elapsedTime);

}


/* =====================================
   START STOPWATCH
===================================== */

function startStopwatch() {

    if (isRunning) {
        return;
    }


    startTime =
        Date.now() - elapsedTime;


    timerInterval =
        setInterval(updateDisplay, 10);


    isRunning = true;


    startBtn.disabled = true;

    pauseBtn.disabled = false;

    lapBtn.disabled = false;


    statusText.textContent = "RUNNING";

    status.classList.add("running");

    status.classList.remove("paused");

}


/* =====================================
   PAUSE STOPWATCH
===================================== */

function pauseStopwatch() {

    if (!isRunning) {
        return;
    }


    clearInterval(timerInterval);


    elapsedTime =
        Date.now() - startTime;


    isRunning = false;


    startBtn.disabled = false;

    pauseBtn.disabled = true;

    lapBtn.disabled = true;


    statusText.textContent = "PAUSED";

    status.classList.remove("running");

    status.classList.add("paused");


    updateDisplay();

}


/* =====================================
   RESET STOPWATCH
===================================== */

function resetStopwatch() {

    clearInterval(timerInterval);


    startTime = 0;

    elapsedTime = 0;

    previousLapTime = 0;


    isRunning = false;


    display.innerHTML =
        "00:00:00<small>.00</small>";


    startBtn.disabled = false;

    pauseBtn.disabled = true;

    lapBtn.disabled = true;


    statusText.textContent = "READY";

    status.classList.remove("running");

    status.classList.remove("paused");


    laps = [];

    renderLaps();

}


/* =====================================
   RECORD LAP
===================================== */

function recordLap() {

    if (!isRunning) {
        return;
    }


    const lapTotal =
        elapsedTime;


    const lapDifference =
        elapsedTime - previousLapTime;


    previousLapTime =
        elapsedTime;


    const lap = {

        number: laps.length + 1,

        total: lapTotal,

        difference: lapDifference

    };


    laps.unshift(lap);


    renderLaps();

}


/* =====================================
   RENDER LAPS
===================================== */

function renderLaps() {

    lapCount.textContent =
        `${laps.length} ${
            laps.length === 1
                ? "Lap"
                : "Laps"
        }`;


    if (laps.length === 0) {

        lapsList.innerHTML = `

            <div class="empty-laps">

                <div class="empty-icon">
                    ⏱
                </div>

                <p>
                    No laps recorded yet
                </p>

                <small>
                    Click the Lap button while
                    the stopwatch is running.
                </small>

            </div>

        `;

        return;
    }


    lapsList.innerHTML = "";


    laps.forEach(function (lap, index) {

        const lapElement =
            document.createElement("div");


        lapElement.className =
            "lap-item";


        lapElement.innerHTML = `

            <span class="lap-number">
                Lap ${lap.number}
            </span>

            <span class="lap-total">
                ${formatLapTime(lap.total)}
            </span>

            <span class="lap-difference">
                + ${formatLapTime(lap.difference)}
            </span>

            <button
                class="delete-lap"
                onclick="deleteLap(${index})"
                title="Delete lap">
                ×
            </button>

        `;


        lapsList.appendChild(lapElement);

    });

}


/* =====================================
   FORMAT LAP TIME
===================================== */

function formatLapTime(time) {

    let hours =
        Math.floor(time / 3600000);

    let minutes =
        Math.floor(
            (time % 3600000) / 60000
        );

    let seconds =
        Math.floor(
            (time % 60000) / 1000
        );

    let milliseconds =
        Math.floor(
            (time % 1000) / 10
        );


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(2, "0")
    );

}


/* =====================================
   DELETE LAP
===================================== */

function deleteLap(index) {

    laps.splice(index, 1);


    /*
       Re-number the remaining laps.
    */

    laps.forEach(function (lap, index) {

        lap.number =
            laps.length - index;

    });


    renderLaps();

}


/* =====================================
   BUTTON EVENTS
===================================== */

startBtn.addEventListener(
    "click",
    startStopwatch
);

pauseBtn.addEventListener(
    "click",
    pauseStopwatch
);

lapBtn.addEventListener(
    "click",
    recordLap
);

resetBtn.addEventListener(
    "click",
    resetStopwatch
);


/* =====================================
   KEYBOARD CONTROLS
===================================== */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           Space = Start / Pause
        */

        if (event.code === "Space") {

            event.preventDefault();


            if (isRunning) {

                pauseStopwatch();

            } else {

                startStopwatch();

            }

        }


        /*
           L = Lap
        */

        if (
            event.key.toLowerCase() === "l"
        ) {

            recordLap();

        }


        /*
           R = Reset
        */

        if (
            event.key.toLowerCase() === "r"
        ) {

            resetStopwatch();

        }

    }
);