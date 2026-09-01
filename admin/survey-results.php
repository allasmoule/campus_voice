<?php
require_once __DIR__ . '/includes/bootstrap.php';
require_login();

$pdo = get_db();

if (($_GET['export'] ?? '') === 'csv') {
    $rows = $pdo->query('SELECT * FROM survey_responses ORDER BY created_at DESC')->fetchAll();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="survey-responses.csv"');

    $out = fopen('php://output', 'w');
    $header = array_merge(
        ['id', 'institution_type', 'role', 'academic_area'],
        LIKERT_FIELDS,
        ['narrative_text', 'standout_moment', 'wish_different', 'improve_exp', 'institution_message', 'created_at']
    );
    fputcsv($out, $header);

    foreach ($rows as $row) {
        $responses = json_decode($row['responses'], true) ?: [];
        $line = array_merge(
            [$row['id'], $row['institution_type'], $row['role'], $row['academic_area']],
            array_map(fn($f) => $responses[$f] ?? '', LIKERT_FIELDS),
            [$row['narrative_text'], $row['standout_moment'], $row['wish_different'], $row['improve_exp'], $row['institution_message'], $row['created_at']]
        );
        fputcsv($out, $line);
    }
    fclose($out);
    exit;
}

$total = (int) $pdo->query('SELECT COUNT(*) FROM survey_responses')->fetchColumn();

$sums = array_fill_keys(LIKERT_FIELDS, 0);
$agreeCounts = array_fill_keys(LIKERT_FIELDS, 0);
$answeredCounts = array_fill_keys(LIKERT_FIELDS, 0);

$stmt = $pdo->query('SELECT responses FROM survey_responses');
foreach ($stmt as $row) {
    $responses = json_decode($row['responses'], true) ?: [];
    foreach ($responses as $field => $value) {
        if (!isset($sums[$field])) continue;
        $sums[$field] += (int) $value;
        $answeredCounts[$field]++;
        if ((int) $value >= 4) $agreeCounts[$field]++;
    }
}

$pageTitle = 'Survey Results';
require __DIR__ . '/includes/header.php';
?>

<div class="stat-grid">
  <div class="stat-tile"><div class="num"><?= $total ?></div><div class="label">Total Responses</div></div>
</div>

<div class="admin-card">
  <div class="flex-between" style="margin-bottom:14px;">
    <strong>Question Averages</strong>
    <a href="?export=csv" class="btn btn-outline btn-sm">Export CSV →</a>
  </div>
  <table>
    <thead><tr><th>Question</th><th>Answered</th><th>Avg (1–5)</th><th>% Agree/Strongly Agree</th></tr></thead>
    <tbody>
      <?php foreach (LIKERT_FIELDS as $field): $n = $answeredCounts[$field]; ?>
      <tr>
        <td><?= e($field) ?></td>
        <td><?= $n ?></td>
        <td><?= $n ? number_format($sums[$field] / $n, 2) : '—' ?></td>
        <td><?= $n ? round(100 * $agreeCounts[$field] / $n) . '%' : '—' ?></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
