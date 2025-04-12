async function getIPInfo() {
    try {
        console.log('Fetching IP from ipify...');
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!ipResponse.ok) {
            throw new Error(`ipify failed: ${ipResponse.status} ${ipResponse.statusText}`);
        }
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        if (!ip) throw new Error('No IP returned from ipify');

        console.log(`IP retrieved: ${ip}. Fetching details from ip-api...`);
        const detailResponse = await fetch(`https://ip-api.com/json/${ip}`, { // Changed to HTTPS
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!detailResponse.ok) {
            throw new Error(`ip-api failed: ${detailResponse.status} ${detailResponse.statusText}`);
        }
        const detailData = await detailResponse.json();
        if (detailData.status === 'fail') {
            throw new Error(`ip-api error: ${detailData.message}`);
        }

        console.log('IP details retrieved successfully');
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
        // Fallback to alternative API
        try {
            console.log('Trying fallback API (ipapi.co)...');
            const fallbackResponse = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!fallbackResponse.ok) {
                throw new Error(`ipapi.co failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
            }
            const fallbackData = await fallbackResponse.json();

            console.log('Fallback API succeeded');
            return {
                ip: fallbackData.ip || "Unknown IP",
                city: fallbackData.city || "Unknown City",
                region: fallbackData.region || "Unknown Region",
                country: fallbackData.country || "Unknown Country",
                isp: fallbackData.org || "Unknown ISP",
                vpn: fallbackData.asn ? false : true // Rough VPN heuristic
            };
        } catch (fallbackError) {
            console.error('Fallback API Error:', fallbackError.message);
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
}
