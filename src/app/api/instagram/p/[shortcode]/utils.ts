import { RequestConfigType } from "@/types/request-config";
import { IG_GraphQLResponseDto } from "@/features/api/_dto/instagram";

import querystring from "querystring";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function generateRequestBody(shortcode: string) {
  return querystring.stringify({
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "b",
    __hs: "20183.HYP:instagram_web_pkg.2.1...0",
    dpr: "3",
    __ccg: "GOOD",
    __rev: "1021613311",
    __s: "hm5eih:ztapmw:x0losd",
    __hsi: "7489787314313612244",
    __dyn:
      "7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJw5ux609vCwjE1EE2Cw8G11wBz81s8hwGxu786a3a1YwBgao6C0Mo2swtUd8-U2zxe2GewGw9a361qw8Xxm16wa-0oa2-azo7u3C2u2J0bS1LwTwKG1pg2fwxyo6O1FwlA3a3zhA6bwIxe6V8aUuwm8jwhU3cyVrDyo",
    __csr:
      "goMJ6MT9Z48KVkIBBvRfqKOkinBtG-FfLaRgG-lZ9Qji9XGexh7VozjHRKq5J6KVqjQdGl2pAFmvK5GWGXyk8h9GA-m6V5yF4UWagnJzazAbZ5osXuFkVeGCHG8GF4l5yp9oOezpo88PAlZ1Pxa5bxGQ7o9VrFbg-8wwxp1G2acxacGVQ00jyoE0ijonyXwfwEnwWwkA2m0dLw3tE1I80hCg8UeU4Ohox0clAhAtsM0iCA9wap4DwhS1fxW0fLhpRB51m13xC3e0h2t2H801HQw1bu02j-",
    __comet_req: "7",
    lsd: "AVrqPT0gJDo",
    jazoest: "2946",
    __spin_r: "1021613311",
    __spin_b: "trunk",
    __spin_t: "1743852001",
    __crn: "comet.igweb.PolarisPostRoute",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_tagged_user_count: null,
      hoisted_comment_id: null,
      hoisted_reply_id: null,
    }),
    server_timestamps: true,
    doc_id: "8845758582119845",
  });
}

export type GetInstagramPostRequest = {
  shortcode: string;
};

export type GetInstagramPostResponse = IG_GraphQLResponseDto;

async function fetchGraphQL(data: GetInstagramPostRequest, requestConfig?: RequestConfigType, userAgent?: string) {
  const requestUrl = new URL("https://www.instagram.com/graphql/query");

  return fetch(requestUrl, {
    credentials: "include",
    headers: {
      "User-Agent": userAgent || getRandomUserAgent(),
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
      "X-BLOKS-VERSION-ID":
        "0d99de0d13662a50e0958bcb112dd651f70dea02e1859073ab25f8f2a477de96",
      "X-CSRFToken": "uy8OpI1kndx4oUHjlHaUfu", // Ideally this should be dynamic
      "X-IG-App-ID": "1217981644879628",
      "X-FB-LSD": "AVrqPT0gJDo", // Ideally this should be dynamic
      "X-ASBD-ID": "359341",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    referrer: `https://www.instagram.com/p/${data.shortcode}/`,
    body: generateRequestBody(data.shortcode),
    method: "POST",
    mode: "cors",
    ...requestConfig,
  });
}

async function fetchHTMLFallback(data: GetInstagramPostRequest) {
  const userAgent = getRandomUserAgent();
  const res = await fetch(`https://www.instagram.com/p/${data.shortcode}/`, {
    headers: {
      "User-Agent": userAgent,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1"
    }
  });

  if (!res.ok) {
    return res; // Propagate error status
  }

  const html = await res.text();

  // Try to parse shared data
  // Look for video_url inside the scripts
  // Pattern 1: xdt_shortcode_media

  // Very simplistic regex extraction for video_url
  // This is fragile but a good fallback
  let videoUrlMatch = html.match(/"video_url"\s*:\s*"([^"]+)"/);

  if (!videoUrlMatch) {
    // Try og:video
    videoUrlMatch = html.match(/<meta property="og:video" content="([^"]+)"/);
  }

  const displayUrlMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
  // const isVideoMatch = html.match(/"is_video":true/); 

  if (!videoUrlMatch) {
    // If we got 200 OK but no video url, it might be a login page or structure changed
    // Check for login
    if (html.includes("Login • Instagram") || html.includes("Welcome back to Instagram")) {
      return new Response(null, { status: 401, statusText: "Login Required" });
    }
    return new Response(null, { status: 404, statusText: "Video not found in HTML" });
  }

  // Construct minimal JSON
  // Unescape unicode chars if necessary. 
  // JSON.parse(`"${match}"`) handles escapes like \u0026

  let videoUrl = "";
  try {
    if (videoUrlMatch[0].startsWith('"video_url"')) {
      videoUrl = JSON.parse(`"${videoUrlMatch[1]}"`);
    } else {
      // It's from meta tag, so it is the string directly (maybe html encoded)
      videoUrl = videoUrlMatch[1].replace(/&amp;/g, "&");
    }
  } catch {
    videoUrl = videoUrlMatch[1];
  }

  const displayUrl = displayUrlMatch ? JSON.parse(`"${displayUrlMatch[1]}"`) : "";

  const mockData: IG_GraphQLResponseDto = {
    data: {
      xdt_shortcode_media: {
        __typename: "GraphVideo",
        __isXDTGraphMediaInterface: "GraphVideo",
        id: "0",
        shortcode: data.shortcode,
        thumbnail_src: displayUrl,
        dimensions: { height: 0, width: 0 },
        gating_info: null,
        fact_check_overall_rating: null,
        fact_check_information: null,
        sensitivity_friction_info: null,
        sharing_friction_info: { should_have_sharing_friction: false, bloks_app_url: null },
        media_overlay_info: null,
        media_preview: "",
        display_url: displayUrl,
        display_resources: [],
        accessibility_caption: null,
        dash_info: { is_dash_eligible: false, video_dash_manifest: "", number_of_qualities: 0 },
        has_audio: true,
        video_url: videoUrl,
        video_view_count: 0,
        video_play_count: 0,
        encoding_status: null,
        is_published: true,
        product_type: "clips",
        title: "",
        video_duration: 0,
        clips_music_attribution_info: { artist_name: "", song_name: "", uses_original_audio: true, should_mute_audio: false, should_mute_audio_reason: "", audio_id: "" },
        is_video: true,
        tracking_token: "",
        upcoming_event: null,
        edge_media_to_tagged_user: { edges: [] },
        owner: { id: "0", username: "instagram_user", is_verified: false, profile_pic_url: "", blocked_by_viewer: false, restricted_by_viewer: null, followed_by_viewer: false, full_name: "", has_blocked_viewer: false, is_embeds_disabled: false, is_private: false, is_unpublished: false, requested_by_viewer: false, pass_tiering_recommendation: false, edge_owner_to_timeline_media: { count: 0 }, edge_followed_by: { count: 0 } },
        edge_media_to_caption: { edges: [] }, // Missing caption is fine
        can_see_insights_as_brand: false,
        caption_is_edited: false,
        has_ranked_comments: false,
        like_and_view_counts_disabled: false,
        edge_media_to_parent_comment: { count: 0, page_info: { has_next_page: false, end_cursor: null }, edges: [] },
        edge_media_to_hoisted_comment: { edges: [] },
        edge_media_preview_comment: { count: 0, edges: [] },
        comments_disabled: false,
        commenting_disabled_for_viewer: false,
        taken_at_timestamp: 0,
        edge_media_preview_like: { count: 0, edges: [] },
        edge_media_to_sponsor_user: { edges: [] },
        is_affiliate: false,
        is_paid_partnership: false,
        location: null,
        nft_asset_info: null,
        viewer_has_liked: false,
        viewer_has_saved: false,
        viewer_has_saved_to_collection: false,
        viewer_in_photo_of_you: false,
        viewer_can_reshare: false,
        is_ad: false,
        edge_web_media_to_related_media: { edges: [] },
        coauthor_producers: [],
        pinned_for_users: []
      }
    },
    extensions: { is_final: true },
    status: "ok"
  };

  return new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function getInstagramPostGraphQL(
  data: GetInstagramPostRequest,
  requestConfig?: RequestConfigType
) {
  // 1. Try HTML Scraping FIRST (Most reliable, least suspicious if headers are right)
  try {
    const htmlResponse = await fetchHTMLFallback(data);
    if (htmlResponse.ok) return htmlResponse;

    // 2. If HTML fails, verify why.
    // If it was 429, strict block. GraphQL won't help. 
    // If 404/401, maybe GraphQL knows better?
    // Let's try GraphQL only if strict block didn't happen
    if (htmlResponse.status !== 429) {
      console.warn(`P1 method skipped (${htmlResponse.status}), switching to API method...`);
      const graphResponse = await fetchGraphQL(data, requestConfig);
      if (graphResponse.ok) return graphResponse;
    }

    return htmlResponse; // Return the first error
  } catch (error) {
    console.error("HTML fetch error:", error);
    // Try GraphQL as last resort
    return fetchGraphQL(data, requestConfig);
  }
}
