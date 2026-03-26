$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

Write-Host ''
Write-Host '============================================================'
Write-Host 'LOADED BONES MULTIPLAYER SERVER LAUNCHER'
Write-Host '============================================================'
Write-Host ''

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host '[ERROR] npm not found. Please install Node.js from https://nodejs.org' -ForegroundColor Red
  exit 1
}

$activeTunnelUrl = $null
$cloudflaredCmd = $null
$ngrokCmd = $null

$cloudflaredFromPath = Get-Command cloudflared -ErrorAction SilentlyContinue
if ($cloudflaredFromPath) {
  $cloudflaredCmd = $cloudflaredFromPath.Source
} elseif (Test-Path "$env:ProgramFiles\cloudflared\cloudflared.exe") {
  $cloudflaredCmd = "$env:ProgramFiles\cloudflared\cloudflared.exe"
} else {
  $wingetPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter cloudflared.exe -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if ($wingetPath) { $cloudflaredCmd = $wingetPath }
}

$ngrokFromPath = Get-Command ngrok -ErrorAction SilentlyContinue
if ($ngrokFromPath) { $ngrokCmd = $ngrokFromPath.Source }

if ($cloudflaredCmd) {
  Write-Host 'Starting Cloudflare quick tunnel on port 3000...'
  Write-Host ''

  $cfLog = Join-Path $env:TEMP 'loadedbones-cloudflared.log'
  if (Test-Path $cfLog) { Remove-Item $cfLog -Force -ErrorAction SilentlyContinue }

  Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

  Start-Process -FilePath $cloudflaredCmd -ArgumentList @('tunnel','--url','http://localhost:3000','--logfile',$cfLog,'--loglevel','info') -WindowStyle Normal | Out-Null

  for ($i = 0; $i -lt 40; $i++) {
    if (Test-Path $cfLog) {
      $matches = Select-String -Path $cfLog -Pattern 'https://[a-z0-9.-]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue
      if ($matches) {
        $activeTunnelUrl = $matches[-1].Matches[0].Value
        break
      }
    }
    Start-Sleep -Seconds 1
  }

  if (-not $activeTunnelUrl) {
    Write-Host '[WARN] Could not detect Cloudflare URL automatically yet.' -ForegroundColor Yellow
    Write-Host "Check log: $cfLog"
  }
} elseif ($ngrokCmd) {
  Write-Host 'Starting ngrok tunnel on port 3000...'
  Write-Host ''

  if (-not (Get-Process ngrok -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $ngrokCmd -ArgumentList @('http','3000') -WindowStyle Normal | Out-Null
    Start-Sleep -Seconds 3
  }

  try {
    $tunnels = Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 3
    $activeTunnelUrl = ($tunnels.tunnels | Where-Object { $_.public_url -like 'https://*' } | Select-Object -First 1 -ExpandProperty public_url)
  } catch {
    Write-Host '[WARN] Could not read ngrok URL from local API.' -ForegroundColor Yellow
  }
} else {
  Write-Host '[ERROR] No tunnel tool found.' -ForegroundColor Red
  Write-Host 'Install Cloudflare Tunnel (recommended):'
  Write-Host '  winget install --id Cloudflare.cloudflared -e'
  Write-Host 'Or install ngrok: https://ngrok.com/download'
  exit 1
}

if ($activeTunnelUrl) {
  Write-Host "Active tunnel URL: $activeTunnelUrl"
  $htmlPath = Join-Path $PSScriptRoot 'loaded_bones.html'
  $html = Get-Content -Path $htmlPath -Raw
  $updated = [regex]::Replace($html, "const PRODUCTION_MULTIPLAYER_SERVER_URL = '.*?';", "const PRODUCTION_MULTIPLAYER_SERVER_URL = '$activeTunnelUrl';", 1)
  if ($updated -ne $html) {
    [System.IO.File]::WriteAllText($htmlPath, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Host 'Updated loaded_bones.html with active tunnel URL.'
  } else {
    Write-Host 'Tunnel URL already current in loaded_bones.html.'
  }

  $shareUrl = "$activeTunnelUrl/loaded_bones.html"
  $shareFile = Join-Path $PSScriptRoot 'latest-multiplayer-link.txt'
  Set-Content -Path $shareFile -Value $shareUrl -Encoding UTF8

  try {
    Set-Clipboard -Value $shareUrl
    Write-Host "Copied share link to clipboard: $shareUrl"
  } catch {
    Write-Host "Share link: $shareUrl"
  }

  Write-Host "Saved share link to: $shareFile"
  Write-Host 'Players can use this link directly (no GitHub Pages update required).'

  try {
    Start-Process $shareUrl | Out-Null
  } catch {
    Write-Host 'Could not auto-open browser; open the share link manually.' -ForegroundColor Yellow
  }
} else {
  Write-Host '[WARN] No active tunnel URL captured. loaded_bones.html was not updated.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'Starting Node.js multiplayer server...'
Write-Host ''

$existingServer = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'server\.js' }

if ($existingServer) {
  Write-Host 'Stopping existing server.js process(es) to free port 3000...'
  foreach ($proc in $existingServer) {
    Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 1
}

npm.cmd start
