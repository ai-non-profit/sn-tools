import { spawn } from 'child_process';

const url = 'https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1745635676&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Linux%20x86_64&browser_version=5.0%20%28X11%3B%20Linux%20x86_64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F137.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&data_collection_enabled=true&device_id=7497448105643329031&device_platform=web_pc&focus_state=true&history_len=3&is_fullscreen=false&is_page_visible=true&language=en&odinId=7497447860569588754&os=linux&priority_region=&referer=&region=VN&screen_height=1050&screen_width=1680&secUid=MS4wLjABAAAAl10spz_7Bt0dWF61AhtDdCaNs2vAbyk3mutP2pHoBspvEaJisnYcZkc4MOjrCPXC&tz_name=Asia%2FSaigon&user_is_login=false&webcast_language=en&msToken=gus1ow3MrfG4cuwunlocyX68EPzeZPx2XAd0sUr0nWdmoy8T3-ULmnLCyAHzH6OVrspgfKWowkxfLjZf94FYzfR-OGvJfszA0Ady6TzFflKyohY8c3BwfvN2QjDa0IuOFqez2-bOhl2jrxM=&X-Bogus=DFSzswVOMfhANrq/CVuzyJeRPDLO&X-Gnarly=MwX/jTXeDuSjo-q/R9zNKpHAV3CnXnhHwq4ssqadAs3s3DUc9WxD1Ck56kdiI7Rjib5aMqZFeUyndqZVuuPkVGefgT0v4ayRHcz3zT2r3DrZ4VhPAQ00bYzmkz6Fr30bkEbjGc05kYovPTnGVIhgDVMSV-ugfSM6mZl6HHd-LGjYZfbdb3U3BEZ0teySe-b4x3qXCCHumwQ7TOlZF6h9zpzYNv5kdH8oiIzbWBSpgk026v1f-rLbNYkiWORWP7gJyRG6OVqvykXU';

const headers = [
    'accept: */*',
    'accept-language: en-US,en;q=0.6',
    'priority: u=1, i',
    'referer: https://www.tiktok.com/@shopt1.com',
    'sec-ch-ua: "Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile: ?0',
    'sec-ch-ua-platform: "Linux"',
    'sec-fetch-dest: empty',
    'sec-fetch-mode: cors',
    'sec-fetch-site: same-origin',
    'sec-gpc: 1',
    'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
];

const cookieString = 'tt_chain_token=pW4m8n/60ABC89xH6mXVAw==; passport_csrf_token=79fbe169cdefe713b9cc426e1f0778df; passport_csrf_token_default=79fbe169cdefe713b9cc426e1f0778df; tiktok_webapp_theme_source=auto; tiktok_webapp_theme=dark; odin_tt=8d83c869868ffd0e9375d3c8f701a6ecda2ecf8409d009ac777bdb9414802971f2b1c15c4fae37e23f6f3f6987ee8ee846b8bb13ce85dfe542dbe8c0c19a5ace6597b326509c150b0bf080d36ecfa43a; delay_guest_mode_vid=5; tt_csrf_token=w9h6dovF-ASIMLwyA7V59zojneMwZ65IbBvo; ttwid=1%7CtSkzoL2V3Doh11N3ayey5N2gcNOS89ybKigQccQUwxA%7C1749018999%7C59c6c5746870389ae564e5888ff0c54bb9b983aa3514e99103198e2b49da02ba; perf_feed_cache={"expireTimestamp":1749189600000,"itemIds":["7503485928640367890","7490422398454467895","7496853139732139265"]}; msToken=gus1ow3MrfG4cuwunlocyX68EPzeZPx2XAd0sUr0nWdmoy8T3-ULmnLCyAHzH6OVrspgfKWowkxfLjZf94FYzfR-OGvJfszA0Ady6TzFflKyohY8c3BwfvN2QjDa0IuOFqez2-bOhl2jrxM=; msToken=vql4Y1yeCKapP5GBGXxoRpm5AA0p5LwpfqGLh7q-kCvFK9k8o7lC8rtLl9uDNXyIajXWzmRkeyZC19Sxr0t34MUsXd5MgUXEc_jjFB4oVymmOi0ncJJnJaVl7-snOsMCGlJTTy2oqILsbUs=';

const args = [
    '-4', // force IPv4
    url,
    '-b', cookieString,
    ...headers.flatMap(h => ['-H', h]),
];

const curl = spawn('curl', args);

curl.stdout.on('data', (data) => {
    console.log(data.toString());
});

curl.stderr.on('data', (data) => {
    // console.log('stderr:', data.toString());
});

curl.on('close', (code) => {
    // console.log(`curl process exited with code ${code}`);
});
