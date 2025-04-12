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

        console.log(`IP retrieved: ${ip}. Fetching details from ipapi.co...`);
        const detailResponse = await fetch('https://ipapi.co/json/', { // Using ipapi.co
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!detailResponse.ok) {
            throw new Error(`ipapi.co failed: ${detailResponse.status} ${detailResponse.statusText}`);
        }
        const detailData = await detailResponse.json();
        if (detailData.error) {
            throw new Error(`ipapi.co error: ${detailData.reason}`);
        }

        console.log('IP details retrieved successfully from ipapi.co');
        return {
            ip: detailData.ip || ip,
            city: detailData.city || "Unknown City",
            region: detailData.region || "Unknown Region",
            country: detailData.country_name || "Unknown Country",
            isp: detailData.org || "Unknown ISP",
            vpn: detailData.asn ? false : true // Rough VPN heuristic
        };
    } catch (error) {
        console.error('Primary API Error:', error.message);
        // Fallback to freeipapi.com
        try {
            console.log('Trying fallback API (freeipapi.com)...');
            const fallbackResponse = await fetch('https://freeipapi.com/api/json', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!fallbackResponse.ok) {
                throw new Error(`freeipapi.com failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
            }
            const fallbackData = await fallbackResponse.json();

            console.log('Fallback API succeeded');
            return {
                ip: fallbackData.ipAddress || "Unknown IP",
                city: fallbackData.cityName || "Unknown City",
                region: fallbackData.regionName || "Unknown Region",
                country: fallbackData.countryName || "Unknown Country",
                isp: fallbackData.isp || "Unknown ISP",
                vpn: false // freeipapi doesn’t provide VPN data
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
