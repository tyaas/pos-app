<?php
$db = new PDO('sqlite:database/database-backup.sqlite');
$result = $db->query('PRAGMA integrity_check');

foreach ($result as $row) {
    echo $row[0] . PHP_EOL;
}
