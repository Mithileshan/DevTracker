@echo off
REM Generate secure random strings for JWT secrets
REM This script generates base64-encoded 32-character secrets suitable for JWT

echo.
echo DevTracker X - Secret Generator
echo ================================
echo.

REM Method 1: Generate using PowerShell
echo Generating JWT secrets using PowerShell...
powershell -Command "Write-Host 'JWT_SECRET:'; Write-Host ([System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 126)}))) -join '').substring(0,32); Write-Host ''; Write-Host 'JWT_REFRESH_SECRET:'; Write-Host ([System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 126)}))) -join '').substring(0,32);"

echo.
echo.
echo Copy these secrets to your .env files:
echo - server/.env (for development)
echo - Railway environment variables (for production)
echo.
echo ⚠️ Never commit .env files to GitHub!
echo.
pause
