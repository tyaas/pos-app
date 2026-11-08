<?php

$db = new SQLite3(__DIR__ . '/database/database-backup.sqlite');

try {
    $result = $db->query(
        "SELECT name FROM sqlite_master WHERE type = 'table'"
    );

    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        echo $row['name'] . PHP_EOL;
    }
} catch (Throwable $e) {
    echo "Gagal membaca tabel: " . $e->getMessage();
}

$db->close();
