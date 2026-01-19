@echo off
title Gestionale - Claude Code Session
color 0A

echo ================================================
echo    GESTIONALE - Ripresa Sessione Claude Code
echo ================================================
echo.
echo INFORMAZIONI PROGETTO:
echo - Cartella: C:\progetti\gestionale
echo - Sito Live: https://gestionale-ernbale.vercel.app
echo - GitHub: https://github.com/ernbale/gestionale-ernbale
echo.
echo PROBLEMA DA RISOLVERE:
echo - La funzione stampa fatture mostra pagina quasi vuota
echo - File da modificare: src\app\fatture\page.tsx
echo.
echo ================================================
echo.

cd /d C:\progetti\gestionale

echo Avvio Claude Code...
echo.
echo Scrivi questo messaggio a Claude:
echo.
echo "Continua il progetto gestionale. Leggi il file PROGETTO_INFO.md
echo per tutte le info. Devi sistemare la funzione stampa fatture
echo che mostra una pagina quasi vuota nell'anteprima di stampa.
echo Il file e' src/app/fatture/page.tsx"
echo.
echo ================================================
echo.

claude

pause
