<?php
declare(strict_types=1);

// Shared by the standalone course gate and Teach Me API. No network calls.
const OLV_CRAWLER_PATTERN = '~bot|crawl|spider|scrap|ChatGPT-User|Claude-User|Perplexity-User|anthropic-ai|cohere-ai|Google-Extended|meta-external|facebookexternalhit|BingPreview|ia_archiver|archive\.org|omgili|ImageSift|curl/|wget/|python[-/]|httpx/|aiohttp/|libwww-perl|Go-http-client|Java/|node-fetch|undici|axios/|PostmanRuntime|HeadlessChrome|PhantomJS|HTTrack|Selenium|Playwright|Puppeteer~i';
const OLV_CRAWLER_ROBOTS = 'noindex, nofollow, nosnippet, noarchive, noimageindex';

function olv_crawler_denied(string $agent): bool
{
    return trim($agent) === '' || preg_match(OLV_CRAWLER_PATTERN, $agent) === 1;
}

function olv_crawler_guard(): void
{
    header('X-Robots-Tag: ' . OLV_CRAWLER_ROBOTS);
    header('X-Olevels-Crawler-Policy: no-crawl-v1');
    if (!olv_crawler_denied($_SERVER['HTTP_USER_AGENT'] ?? '')) { return; }
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: private, no-store');
    header('CDN-Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'HEAD') {
        echo 'Automated access is not permitted. Course content is protected by copyright.';
    }
    exit;
}

function olv_course_copyright(): string
{
    return '<footer id="olv-course-copyright" aria-label="Copyright and content use"'
        . ' style="clear:both;max-width:1100px;margin:32px auto 0;padding:18px 24px 88px;'
        . 'border-top:1px solid var(--rule,currentColor);font-family:inherit;font-size:12px;line-height:1.6;color:inherit">'
        . '<strong>&copy; ' . gmdate('Y') . ' olevels.com. All rights reserved.</strong> '
        . 'Course content is protected by copyright. Copying, redistribution, scraping, automated extraction '
        . 'and use for AI training are prohibited without prior written permission. '
        . 'Third-party materials remain the property of their respective copyright holders.</footer>';
}

function olv_course_protect_html(string $html): string
{
    if (strpos($html, 'data-olv-crawler-policy') === false) {
        $meta = '<meta name="robots" content="' . OLV_CRAWLER_ROBOTS . '" data-olv-crawler-policy="1">';
        $at = stripos($html, '</head>');
        if ($at !== false) { $html = substr_replace($html, $meta, $at, 0); }
    }
    if (strpos($html, 'id="olv-course-copyright"') === false) {
        $at = strripos($html, '</body>');
        $html = $at === false ? $html . olv_course_copyright() : substr_replace($html, olv_course_copyright(), $at, 0);
    }
    return $html;
}
