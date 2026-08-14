<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

// Prepare writable storage directories in /tmp for Vercel Serverless environment
$storagePath = '/tmp/storage';
$directories = [
    $storagePath . '/framework/views',
    $storagePath . '/framework/cache',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/logs',
    $storagePath . '/app/public',
    '/tmp/bootstrap/cache',
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

// Ensure HTTPS is recognized behind Vercel edge reverse proxies
if ((isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
    (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') ||
    isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL'])) {
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SERVER_PORT'] = '443';
}

// Fallback APP_KEY if not configured in Vercel environment variables
$appKey = getenv('APP_KEY') ?: ($_ENV['APP_KEY'] ?? ($_SERVER['APP_KEY'] ?? ''));
if (empty($appKey)) {
    $defaultKey = 'base64:w09U+OfXoQp38XlGjWeV+H2VB3AeesjiqFSpicKIM1I=';
    putenv("APP_KEY={$defaultKey}");
    $_ENV['APP_KEY'] = $defaultKey;
    $_SERVER['APP_KEY'] = $defaultKey;
}

putenv("APP_CONFIG_CACHE=/tmp/config.php");
putenv("APP_EVENTS_CACHE=/tmp/events.php");
putenv("APP_PACKAGES_CACHE=/tmp/packages.php");
putenv("APP_ROUTES_CACHE=/tmp/routes.php");
putenv("APP_SERVICES_CACHE=/tmp/services.php");
putenv("VIEW_COMPILED_PATH=/tmp/storage/framework/views");
putenv("LOG_CHANNEL=stderr");
putenv("VERCEL=1");

$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
$_ENV['LOG_CHANNEL'] = 'stderr';
$_ENV['VERCEL'] = '1';

// Fallback to SQLite in /tmp if external database is not configured
$dbHost = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ($_SERVER['DB_HOST'] ?? ''));
$dbConnection = getenv('DB_CONNECTION') ?: ($_ENV['DB_CONNECTION'] ?? ($_SERVER['DB_CONNECTION'] ?? ''));

$sqliteFile = '/tmp/database.sqlite';
$isFreshSqlite = false;
if (!$dbConnection || $dbConnection === 'sqlite' || $dbHost === '127.0.0.1' || $dbHost === 'localhost') {
    putenv("DB_CONNECTION=sqlite");
    putenv("DB_DATABASE={$sqliteFile}");
    $_ENV['DB_CONNECTION'] = 'sqlite';
    $_ENV['DB_DATABASE'] = $sqliteFile;
    $_SERVER['DB_CONNECTION'] = 'sqlite';
    $_SERVER['DB_DATABASE'] = $sqliteFile;

    if (!file_exists($sqliteFile) || filesize($sqliteFile) === 0) {
        $sourceSqlite = __DIR__ . '/../database/database.sqlite';
        if (file_exists($sourceSqlite) && filesize($sourceSqlite) > 0) {
            @copy($sourceSqlite, $sqliteFile);
        } else {
            @touch($sqliteFile);
            $isFreshSqlite = true;
        }
    }
}

if (!defined('LARAVEL_START')) {
    define('LARAVEL_START', microtime(true));
}

require __DIR__ . '/../vendor/autoload.php';

/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->useStoragePath($storagePath);

// Auto-migrate & seed SQLite on cold start if database is brand new
if ($isFreshSqlite) {
    try {
        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);
    } catch (\Throwable $e) {
        error_log('[Vercel] Migration/Seed error: ' . $e->getMessage());
    }
}

try {
    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    error_log('[Vercel Exception] ' . $e->getMessage() . "\n" . $e->getTraceAsString());
    http_response_code(500);
    if (getenv('APP_DEBUG') === 'true' || ($_ENV['APP_DEBUG'] ?? '') === 'true' || ($_SERVER['APP_DEBUG'] ?? '') === 'true') {
        header('Content-Type: text/html; charset=utf-8');
        echo "<h1>500 Server Error</h1>";
        echo "<p><strong>Message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<p><strong>File:</strong> " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "</p>";
        echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    } else {
        echo "500 Server Error";
    }
}



