# Import carnest.sql into running MariaDB container (Windows PowerShell)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Waiting for MariaDB..."
docker compose -f "$Root\docker-compose.yml" up -d
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  $status = docker inspect -f "{{.State.Health.Status}}" carnest-mariadb 2>$null
  if ($status -eq "healthy") { $ready = $true; break }
  Start-Sleep -Seconds 2
}
if (-not $ready) { throw "MariaDB did not become healthy in time." }

Write-Host "Importing carnest.sql (this may take a minute)..."
Get-Content -Path "$Root\carnest.sql" -Raw -Encoding UTF8 | docker exec -i carnest-mariadb mysql -uroot -pcarnest_root carnest

Write-Host "Verifying..."
docker exec carnest-mariadb mysql -uroot -pcarnest_root -e "SELECT COUNT(*) AS cars FROM carnest.cars; SHOW DATABASES LIKE 'carnest_demo_hub';"
Write-Host "Done. Run: cd server && npm run seed:demo-hub && npm run dev"
