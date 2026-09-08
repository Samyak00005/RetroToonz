@echo off
setlocal
cd /d "%~dp0\.."
node tools\prepare-media.mjs %*
endlocal
