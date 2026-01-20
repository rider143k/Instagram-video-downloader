import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{
        username: string;
        storyId: string;
    }>;
}

export async function GET(_: NextRequest, context: RouteContext) {
    const { username, storyId } = await context.params;

    if (!username || !storyId) {
        return NextResponse.json(
            { error: "Username and story ID are required" },
            { status: 400 }
        );
    }

    console.log(`[Story] Attempting to fetch story: ${username}/${storyId}`);

    try {
        // Method 1: Try direct story URL with multiple user agents
        const storyUrl = `https://www.instagram.com/stories/${username}/${storyId}/`;

        // Try with mobile user agent first (sometimes works better)
        const userAgents = [
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
        ];

        let html: string | null = null;

        for (const userAgent of userAgents) {
            try {
                console.log(`[Story] Trying with user agent: ${userAgent.substring(0, 50)}...`);

                const response = await fetch(storyUrl, {
                    headers: {
                        "User-Agent": userAgent,
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9",
                        "Referer": "https://www.instagram.com/",
                        "Sec-Fetch-Dest": "document",
                        "Sec-Fetch-Mode": "navigate",
                        "Sec-Fetch-Site": "same-origin",
                    },
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                });

                if (response.ok) {
                    html = await response.text();
                    console.log(`[Story] Successfully fetched HTML (${html.length} bytes)`);
                    break;
                }
            } catch {
                console.log(`[Story] Failed with this user agent, trying next...`);
                continue;
            }
        }

        if (!html) {
            console.log(`[Story] All user agents failed`);
            return NextResponse.json(
                { error: "Story not found. It may be private, expired (>24h), or from a private account." },
                { status: 404 }
            );
        }

        // Extract media URL using multiple methods
        let mediaUrl: string | null = null;
        let mediaType: "photo" | "video" = "photo";

        // Method 1: Look for application/ld+json
        const ldJsonMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/);
        if (ldJsonMatch) {
            try {
                const jsonData = JSON.parse(ldJsonMatch[1]);
                console.log(`[Story] Found ld+json data`);

                if (jsonData.video) {
                    mediaUrl = jsonData.video.contentUrl || jsonData.video.url;
                    mediaType = "video";
                } else if (jsonData.image) {
                    mediaUrl = jsonData.image.url || jsonData.image;
                    mediaType = "photo";
                }
            } catch (e) {
                console.log(`[Story] Failed to parse ld+json:`, e);
            }
        }

        // Method 2: Look for video_url in HTML
        if (!mediaUrl) {
            const videoUrlMatch = html.match(/"video_url":\s*"([^"]+)"/);
            if (videoUrlMatch) {
                mediaUrl = videoUrlMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
                mediaType = "video";
                console.log(`[Story] Found video_url in HTML`);
            }
        }

        // Method 3: Look for display_url in HTML
        if (!mediaUrl) {
            const displayUrlMatch = html.match(/"display_url":\s*"([^"]+)"/);
            if (displayUrlMatch) {
                mediaUrl = displayUrlMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
                mediaType = "photo";
                console.log(`[Story] Found display_url in HTML`);
            }
        }

        // Method 4: Look for image_versions2 or video_versions
        if (!mediaUrl) {
            const videoVersionsMatch = html.match(/"video_versions":\s*\[([^\]]+)\]/);
            if (videoVersionsMatch) {
                try {
                    const versions = JSON.parse(`[${videoVersionsMatch[1]}]`);
                    if (versions.length > 0 && versions[0].url) {
                        mediaUrl = versions[0].url;
                        mediaType = "video";
                        console.log(`[Story] Found video from video_versions`);
                    }
                } catch {
                    console.log(`[Story] Failed to parse video_versions`);
                }
            }
        }

        if (!mediaUrl) {
            const imageVersionsMatch = html.match(/"image_versions2":\s*{\s*"candidates":\s*\[([^\]]+)\]/);
            if (imageVersionsMatch) {
                try {
                    const candidates = JSON.parse(`[${imageVersionsMatch[1]}]`);
                    if (candidates.length > 0 && candidates[0].url) {
                        mediaUrl = candidates[0].url;
                        mediaType = "photo";
                        console.log(`[Story] Found image from image_versions2`);
                    }
                } catch {
                    console.log(`[Story] Failed to parse image_versions2`);
                }
            }
        }

        // Method 5: Look for og:image or og:video meta tags
        if (!mediaUrl) {
            const ogVideoMatch = html.match(/<meta property="og:video" content="([^"]+)"/);
            const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

            if (ogVideoMatch) {
                mediaUrl = ogVideoMatch[1];
                mediaType = "video";
                console.log(`[Story] Found og:video meta tag`);
            } else if (ogImageMatch) {
                mediaUrl = ogImageMatch[1];
                mediaType = "photo";
                console.log(`[Story] Found og:image meta tag`);
            }
        }

        if (!mediaUrl) {
            console.log(`[Story] No media URL found after trying all methods`);
            return NextResponse.json(
                {
                    error: "Could not extract story media. This story may be:\n• From a private account\n• Expired (older than 24 hours)\n• Protected by Instagram\n\nNote: Story downloads have ~30-50% success rate due to Instagram's restrictions."
                },
                { status: 404 }
            );
        }

        console.log(`[Story] Successfully extracted ${mediaType} URL`);

        return NextResponse.json({
            data: {
                url: mediaUrl,
                type: mediaType,
                username: username,
                storyId: storyId,
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("[Story] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch story. Instagram may be blocking the request.", message: error.message },
            { status: 500 }
        );
    }
}
