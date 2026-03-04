let tape = [];
let head = 0;
let currentState = "q1";
let isRunning = false;


function renderTape() {
    const cont = document.getElementById("tapeContainer");
    cont.innerHTML = "";

    tape.forEach((sym, index) => {
        const cell = document.createElement("div");
        cell.className = "tapeCell";
        if (index === head) cell.classList.add("tapeHead");
        cell.textContent = sym;
        cont.appendChild(cell);
    });
}

// Update status text
function updateStatus(msg) {
    document.getElementById("statusBox").innerText = "State Status: " + msg;
}

// Highlight current state
function activateState(id) {
    document.querySelectorAll(".state").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// TM transition table
const TM = {
    "q1": { "0": {write:"B", move:"R", next:"q2"},
            "1": {write:"B", move:"R", next:"q5"},
            "B": {write:"B", move:"L", next:"accepted"} },

    "q2": { "0": {write:"0", move:"R", next:"q2"},
            "1": {write:"1", move:"R", next:"q2"},
            "B": {write:"B", move:"L", next:"q3"} },

    "q3": { "0": {write:"B", move:"L", next:"q4"},
            "B": {write:"B", move:"L", next:"q4"} },

    "q4": { "0": {write:"0", move:"L", next:"q4"},
            "1": {write:"1", move:"L", next:"q4"},
            "B": {write:"B", move:"R", next:"q1"} },

    "q5": { "0": {write:"0", move:"R", next:"q5"},
            "1": {write:"1", move:"R", next:"q5"},
            "B": {write:"B", move:"L", next:"q6"} },

    "q6": { "1": {write:"B", move:"L", next:"q7"},
            "B": {write:"B", move:"L", next:"q7"} },

    "q7": { "0": {write:"0", move:"L", next:"q7"},
            "1": {write:"1", move:"L", next:"q7"},
            "B": {write:"B", move:"R", next:"q1"} }
};

// Move tape head
function moveHead(dir) {
    if (dir === "R") head++;
    if (dir === "L") head--;

    if (head < 0) {
        tape.unshift("B");
        head = 0;
    }
    if (head >= tape.length) tape.push("B");

    renderTape();
}

// Animation step
function step() {
    if (currentState === "accepted") {
        activateState("accepted");
        updateStatus("ACCEPTED");
        isRunning = false;
        return;
    }

    let symbol = tape[head];
    let rule = TM[currentState][symbol];

    if (!rule) {
        updateStatus("REJECTED (No rule for symbol " + symbol + ")");
        isRunning = false;
        return;
    }

    tape[head] = rule.write;
    moveHead(rule.move);

    currentState = rule.next;
    activateState(currentState);
    updateStatus(`State: ${currentState} | Head: ${head}`);

    if (isRunning)
        setTimeout(step, 600);
}

// Start simulation
document.getElementById("runBtn").onclick = () => {
    const input = document.getElementById("inputTape").value.trim();

    if (!/^[01]*$/.test(input)) {
        alert("Input must contain only 0 or 1!");
        return;
    }

    tape = input.split("");
    head = 0;
    currentState = "q1";
    isRunning = true;

    activateState("q1");
    renderTape();
    updateStatus("Running...");

    step();
};
