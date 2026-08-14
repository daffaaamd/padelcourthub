<?php

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

require __DIR__ . '/../public/index.php';
