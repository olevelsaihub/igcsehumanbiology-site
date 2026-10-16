<?php
/**
 * Human Biology 4HB1 answer checking (server side). Mirrors work/marking.py; no AI at marking time.
 * POST {"part": id, "answer": text} -> feedback after submission.
 * Rules come from the private bundle outside the web root (never served):
 *   {private_dir}/human-biology-marking/bundle.json   (built by work/build_marking_bundle.py)
 * Open access (Bareera, 14 Oct 2026): anyone may check answers. Answer keys stay in the private bundle outside the
 * web root and only a verdict is returned. With 'open_access' => false the request must carry a verified course
 * session from auth-gate.php (same PHP session and policy).
 * PHP 7.4 compatible. Not deployed: local build only until a release is approved.
 */
declare(strict_types=1);

function hb_mk_numbers(string $text): array {
    $out = [];
    $text = (string)preg_replace('/(?<![a-z])(?:[cdkm\x{00B5}u]?m)\s?[\x{00B2}\x{00B3}23](?![\d])/iu', ' ', $text);
    if (!preg_match_all('/[-\x{2212}\x{2013}]?\d[\d\s,]*(?:\.\d+)?/u', $text, $m)) return $out;
    foreach ($m[0] as $raw) {
        $raw = preg_replace('/(?<=\d)[\s,](?=\d{3}(?!\d))/u', '', $raw);
        $raw = str_replace([' ', "\u{2212}", "\u{2013}"], ['', '-', '-'], $raw);
        if (is_numeric($raw)) $out[] = (float)$raw;
    }
    return $out;
}

function hb_mk_close(float $x, array $values, float $tol): bool {
    foreach ($values as $v) if (abs($x - (float)$v) <= max($tol, 1e-9) + 1e-9) return true;
    return false;
}

function hb_mk_check(array $rule, string $answer): array {
    $mode = $rule['mode'];
    if ($mode === 'mcq') {
        $letter = strtoupper(substr(trim($answer), 0, 1));
        $ok = $letter === $rule['key'];
        return ['mode' => 'mcq', 'marks' => $ok ? $rule['max'] : 0, 'max' => $rule['max'], 'correct' => $ok, 'key' => $rule['key']];
    }
    if ($mode === 'numeric') {
        $ans = $rule['answer'];
        $tol = (float)($ans['tol'] ?? 0);
        $text = $answer;
        if (($ans['form'] ?? '') === 'n:1') $text = (string)preg_replace('/:\s*1(?:\.0+)?\s*$/', '', trim($text));
        $nums = hb_mk_numbers($text);
        $final = $nums ? end($nums) : null;
        $ok = $final !== null && hb_mk_close($final, $ans['values'], $tol);
        return ['mode' => 'numeric', 'marks' => $ok ? $rule['max'] : 0, 'max' => $rule['max'], 'correct' => $ok,
                'note' => $ok ? '' : 'Check your working step by step. Your teacher can award method marks from your working.'];
    }
    if ($mode === 'self') {
        return ['mode' => 'self', 'marks' => null, 'max' => $rule['max'], 'checklist' => $rule['checklist'],
                'credit' => $rule['credit'] ?? '', 'tip' => $rule['self_mark_tip'] ?? ''];
    }
    throw new RuntimeException('unknown mode');
}

function hb_mk_signed_in(array $config): bool {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_name($config['gate_session']);
        ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1');
        if (!session_start(['read_and_close' => true])) return false;
    }
    $decision = $_SESSION['decision'] ?? null;
    return is_array($decision) && ($decision['policy'] ?? '') === $config['policy']
        && (($decision['result']['status'] ?? null) === 200);
}

if (PHP_SAPI !== 'cli' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    try {
        if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') throw new RuntimeException('POST only');
        require_once dirname(__DIR__) . '/human-biology-config.php';
        $config = hb_config();
        if ($config['open_access'] !== true && ((int)$config['course_id'] < 1 || !hb_mk_signed_in($config))) {
            http_response_code(403);
            echo json_encode(['error' => 'Sign in to the course to check your answers.']);
            exit;
        }
        $bundleFile = rtrim((string)$config['private_dir'], '/') . '/human-biology-marking/bundle.json';
        $bundle = json_decode((string)file_get_contents($bundleFile), true);
        $req = json_decode((string)file_get_contents('php://input', false, null, 0, 20000), true) ?: [];
        $rule = $bundle['rules'][(string)($req['part'] ?? '')] ?? null;
        if (!$rule) throw new RuntimeException('no checking rule for this part');
        echo json_encode(hb_mk_check($rule, substr((string)($req['answer'] ?? ''), 0, 5000)));
    } catch (Throwable $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Answer checking is not available right now.']);
    }
}
