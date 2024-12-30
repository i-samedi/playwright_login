const fs = require('fs');
const path = require('path');

function generateCustomReport(jsonReport) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        .success { color: #198754; }
        .failure { color: #dc3545; }
        .test-card {
            transition: transform 0.2s;
        }
        .test-card:hover {
            transform: translateY(-5px);
        }
    </style>
</head>
<body class="bg-light">
    <nav class="navbar navbar-dark bg-primary">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">Test Results Dashboard</span>
        </div>
    </nav>
    
    <div class="container mt-4">
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card bg-white shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Total Tests</h5>
                        <h2 class="mb-0">${jsonReport.totalTests}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-white shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Passed</h5>
                        <h2 class="mb-0 success">${jsonReport.passed}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-white shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Failed</h5>
                        <h2 class="mb-0 failure">${jsonReport.failed}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-white shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Duration</h5>
                        <h2 class="mb-0">${Math.round(jsonReport.duration / 1000)}s</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Test Results</h5>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Test</th>
                                        <th>Status</th>
                                        <th>Duration</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${jsonReport.tests.map(test => `
                                        <tr>
                                            <td>${test.title}</td>
                                            <td>
                                                <span class="badge ${test.status === 'passed' ? 'bg-success' : 'bg-danger'}">
                                                    ${test.status}
                                                </span>
                                            </td>
                                            <td>${Math.round(test.duration / 1000)}s</td>
                                            <td>
                                                ${test.error ? `
                                                    <button class="btn btn-sm btn-outline-danger" type="button" 
                                                            data-bs-toggle="collapse" 
                                                            data-bs-target="#error-${test.id}">
                                                        Show Error
                                                    </button>
                                                    <div class="collapse mt-2" id="error-${test.id}">
                                                        <div class="card card-body">
                                                            <pre class="mb-0"><code>${test.error}</code></pre>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;
}

// Leer el archivo JSON de resultados
const jsonReport = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../test-results/json-report/test-results.json'), 
    'utf8'
));

// Procesar los resultados
const processedReport = {
    totalTests: jsonReport.suites[0].specs.length,
    passed: jsonReport.suites[0].specs.filter(s => s.ok).length,
    failed: jsonReport.suites[0].specs.filter(s => !s.ok).length,
    duration: jsonReport.duration,
    tests: jsonReport.suites[0].specs.map((spec, index) => ({
        id: index,
        title: spec.title,
        status: spec.ok ? 'passed' : 'failed',
        duration: spec.duration,
        error: spec.error?.message || null
    }))
};

// Generar y guardar el reporte HTML
const htmlReport = generateCustomReport(processedReport);
fs.writeFileSync(
    path.join(__dirname, '../test-results/custom-report/index.html'),
    htmlReport
); 