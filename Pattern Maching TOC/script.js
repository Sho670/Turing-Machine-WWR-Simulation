const svg = document.getElementById("nfa");

// Helper to make SVG elements
function make(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let a in attrs) el.setAttribute(a, attrs[a]);
    return el;
}

// --- STATE POSITIONS ---
const states = {
    p: { x: 120, y: 200, accept: false },
    q: { x: 300, y: 200, accept: false },
    r: { x: 480, y: 200, accept: false },
    s: { x: 650, y: 200, accept: true },
    t: { x: 300, y: 320, accept: false },
    u: { x: 480, y: 320, accept: true }
};

// --- NFA TRANSITIONS ---
const transitions = [
    { from: "p", to: "p", label: "a,b,c", loop: true },
    { from: "p", to: "q", label: "a" },
    { from: "q", to: "r", label: "b" },
    { from: "r", to: "s", label: "c" },
    { from: "s", to: "s", label: "a,b,c", loop: true },
    { from: "p", to: "t", label: "a" },
    { from: "t", to: "u", label: "c" }
];

// --- ARROW MARKER ---
const marker = make("marker", {
    id: "arrow",
    viewBox: "0 0 10 10",
    refX: 10,
    refY: 5,
    markerWidth: 6,
    markerHeight: 6,
    orient: "auto",
    class: "marker"
});
marker.appendChild(make("path", { d: "M 0 0 L 10 5 L 0 10 z" }));
svg.appendChild(marker);

// --- DRAW STATES ---
let stateElements = {};

for (let s in states) {
    const { x, y, accept } = states[s];

    // Accepting outer circle
    if (accept) {
        svg.appendChild(make("circle", {
            cx: x,
            cy: y,
            r: 36,
            class: "state accept"
        }));
    }

    // Main state circle
    const circle = make("circle", {
        cx: x,
        cy: y,
        r: 30,
        class: "state",
        id: "state-" + s
    });
    svg.appendChild(circle);
    stateElements[s] = circle;

    // Text label
    const text = make("text", {
        x: x,
        y: y + 6,
        class: "label",
        "text-anchor": "middle"
    });
    text.textContent = s;
    svg.appendChild(text);
}

// --- INITIAL STATE TRIANGLE (left of p) ---
const p = states.p;
svg.appendChild(make("polygon", {
    points: `${p.x - 60},${p.y}  ${p.x - 80},${p.y - 15}  ${p.x - 80},${p.y + 15}`,
    fill: "#333"
}));

// --- DRAW TRANSITIONS ---
transitions.forEach(t => {
    const from = states[t.from];
    const to = states[t.to];

    if (t.loop) {
        // Self loop
        svg.appendChild(make("path", {
            d: `M ${from.x} ${from.y - 30}
                C ${from.x - 40} ${from.y - 80},
                  ${from.x + 40} ${from.y - 80},
                  ${from.x} ${from.y - 30}`,
            stroke: "#333",
            fill: "transparent",
            "marker-end": "url(#arrow)"
        }));

        svg.appendChild(make("text", {
            x: from.x,
            y: from.y - 90,
            class: "label",
            "text-anchor": "middle"
        })).textContent = t.label;
        return;
    }

    svg.appendChild(make("line", {
        x1: from.x + 30,
        y1: from.y,
        x2: to.x - 30,
        y2: to.y,
        stroke: "#333",
        "marker-end": "url(#arrow)"
    }));

    svg.appendChild(make("text", {
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2 - 10,
        class: "label"
    })).textContent = t.label;
});

// --- NFA SIMULATION WITH ANIMATION ---
function epsilonClosure(statesArr) {
    return new Set(statesArr); // no epsilon in this NFA
}

function step(statesArr, symbol) {
    let next = new Set();
    transitions.forEach(t => {
        if (t.label.split(",").includes(symbol)) {
            if (statesArr.has(t.from)) next.add(t.to);
        }
    });
    return epsilonClosure(next);
}

async function highlight(statesArr) {
    // Remove highlights
    for (let s in stateElements)
        stateElements[s].classList.remove("active");

    // Highlight active
    statesArr.forEach(s => {
        stateElements[s].classList.add("active");
    });

    await new Promise(res => setTimeout(res, 600));
}

async function runNFA() {
    const input = document.getElementById("userInput").value.trim();
    let current = epsilonClosure(["p"]);
    let log = `Start at { p }<br>`;

    await highlight(current);

    for (let ch of input) {
        if (!["a", "b", "c"].includes(ch)) {
            document.getElementById("result").innerHTML =
                "Invalid character: " + ch;
            return;
        }

        current = step(current, ch);
        log += `Read '${ch}' → { ${[...current].join(", ")} }<br>`;

        await highlight(current);
    }

    const accept = [...current].some(s => states[s].accept);
    log += `<br><b>Final result:</b> ${accept ? "ACCEPTED ✅" : "REJECTED ❌"}`;

    document.getElementById("result").innerHTML = log;
}