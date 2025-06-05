
export async function searchTiktok(search, cookies, { maxDownloads, startDate, endDate }) {
  console.log(startDate);
  console.log(endDate);
  const options = {
    method: 'GET',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.8',
      priority: 'u=1, i',
      'sec-ch-ua': '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      Cookie: cookies
    }
  };
  const params = new URLSearchParams({
    WebIdLastTime: Date.now().toString(),
    aid: '1988',
    app_language: 'en',
    app_name: 'tiktok_web',
    browser_language: 'en-US',
    browser_name: 'Mozilla',
    browser_online: 'true',
    browser_platform: 'Linux x86_64',
    browser_version: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    channel: 'tiktok_web',
    cookie_enabled: 'true',
    data_collection_enabled: 'true',
    device_id: '7497448105643329031',
    device_platform: 'web_pc',
    device_type: 'web_h264',
    focus_state: 'true',
    from_page: 'search',
    history_len: '3',
    is_fullscreen: 'false',
    is_page_visible: 'true',
    keyword: search,
    odinId: '7497447860569588754',
    os: 'linux',
    region: 'VN',
    screen_height: '1050',
    screen_width: '1680',
    search_source: 'normal_search',
    tz_name: 'Asia/Saigon',
    user_is_login: 'false',
    web_search_code: '{"tiktok":{"client_params_x":{"search_engine":{"ies_mt_user_live_video_card_use_libra":1,"mt_search_general_user_live_card":1}},"search_server":{}}}',
    webcast_language: 'en',
  });
  let url = 'https://www.tiktok.com/api/search/general/full/?' + params.toString();
  const result = [];
  let json = null;
  main: do {
    console.count('Page');
    url = 'https://www.tiktok.com/api/search/general/full/?' + params.toString();
    const res = await fetch(url, options);
    json = await res.json();
    const msToken = res.headers.get('set-cookie') || '';
    params.set('focus_state', 'false');
    params.set('msToken', msToken.match(/msToken=([^;]+)/)[1]);
    params.set('offset', json?.cursor || '0');
    if (!params.has('search_id')) {
      params.set('search_id', json?.extra?.logid || '');
    }
    options.headers.Cookie = cookies + '; ' + msToken;
    for (const { type, item } of json?.data || []) {
      console.log(item.id);
      if (type !== 1 || item.createTime <= startDate || item.createTime >= endDate) continue;
      result.push(item);
      if (result.length >= maxDownloads) {
        console.log('Max downloads reached:', maxDownloads);
        break main;
      }
    }
  } while (json?.has_more === 1)
  console.countReset('Page');
  return {
    success: true,
    data: result,
  };
}

const cookie = 'tt_chain_token=pW4m8n/60ABC89xH6mXVAw==; passport_csrf_token=79fbe169cdefe713b9cc426e1f0778df; passport_csrf_token_default=79fbe169cdefe713b9cc426e1f0778df; tiktok_webapp_theme_source=auto; tiktok_webapp_theme=dark; odin_tt=8d83c869868ffd0e9375d3c8f701a6ecda2ecf8409d009ac777bdb9414802971f2b1c15c4fae37e23f6f3f6987ee8ee846b8bb13ce85dfe542dbe8c0c19a5ace6597b326509c150b0bf080d36ecfa43a; delay_guest_mode_vid=5; perf_feed_cache={%22expireTimestamp%22:1749024000000%2C%22itemIds%22:[%227505479865978604818%22%2C%227479095506803739912%22]}; tt_csrf_token=HkqUflGF-AZdbbQ-BsJq8qGWnM3jP66-pqDU; ttwid=1%7CtSkzoL2V3Doh11N3ayey5N2gcNOS89ybKigQccQUwxA%7C1748854912%7Ca43df1490126e2d8b24fa9651977a8f463acea53fb8e16e0ad6053f4c19c3ed5; msToken=XwQ6Awr4YaPysXaRH-u-8OIzPDxiO43eQmk9-CLuG5iY-o-EFm4u-8dnvuIHIUjbzBV6paQeoqjF99E_Pa4Q4imLHRtSSle9tbr6j5_Di4cmaQSPqDrbUfwyVj7U1ObQqwM0XBATM7UvSx0=; msToken=q8QYkZc2sO9RxsdUFdWWS1NmSonyFnu2l3bpl9Mv-RwD7FBgoS8YcWqqmIpAfcMs2Tpj_PL0vuW-FjFia1fVRtTriFIHDNbyu-jch9JRT-adu1FZBRQd_cvG08k-5uHey6IURmTiBO6xzEI=';
searchTiktok('shimeji', cookie, {
  maxDownloads: 100,
  startDate: 1741107600,
  endDate: Date.now()
}).catch(console.error);