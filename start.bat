@echo off
rem Startet das Sonnensystem lokal und oeffnet den Browser.
cd /d "%~dp0"
set PORT=8080
where py >nul 2>nul && (start "" http://localhost:%PORT%/ & py -m http.server %PORT% & goto :eof)
where python >nul 2>nul && (start "" http://localhost:%PORT%/ & python -m http.server %PORT% & goto :eof)
where npx >nul 2>nul && (start "" http://localhost:%PORT%/ & npx --yes http-server -p %PORT% -c-1 & goto :eof)
echo Kein Python oder Node.js gefunden. Bitte Python von https://www.python.org installieren.
pause
