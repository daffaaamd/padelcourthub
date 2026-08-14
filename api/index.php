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
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

putenv("APP_CONFIG_CACHE=/tmp/config.php");
putenv("APP_EVENTS_CACHE=/tmp/events.php");
putenv("APP_PACKAGES_CACHE=/tmp/packages.php");
putenv("APP_ROUTES_CACHE=/tmp/routes.php");
putenv("APP_SERVICES_CACHE=/tmp/services.php");
putenv("VIEW_COMPILED_PATH=/tmp/storage/framework/views");
putenv("LOG_CHANNEL=stderr");

// Fallback to SQLite in /tmp if external database is not configured
$dbHost = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? '');
$dbConnection = getenv('DB_CONNECTION') ?: ($_ENV['DB_CONNECTION'] ?? '');

$isFreshSqlite = false;
if (!$dbConnection || $dbConnection === 'sqlite' || $dbHost === '127.0.0.1' || $dbHost === 'localhost') {
    putenv("DB_CONNECTION=sqlite");
    putenv("DB_DATABASE=/tmp/database.sqlite");
    $_ENV['DB_CONNECTION'] = 'sqlite';
    $_ENV['DB_DATABASE'] = '/tmp/database.sqlite';

    if (!file_exists('/tmp/database.sqlite') || filesize('/tmp/database.sqlite') === 0) {
        @touch('/tmp/database.sqlite');
        $isFreshSqlite = true;
    }
}

if (!defined('LARAVEL_START')) {
    define('LARAVEL_START', microtime(true));
}

require __DIR__ . '/../vendor/autoload.php';

/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Auto-migrate & seed SQLite on cold start if empty
if ($isFreshSqlite) {
    try {
        Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
    } catch (\Throwable $e) {
        error_log('Database initialization notice: ' . $e->getMessage());
    }
}

$app->handleRequest(Request::capture());
