@echo off
setlocal enabledelayedexpansion

title Deploy Magic Embroidery to GitHub Pages

echo ======================================================
echo       Magic Embroidery - GitHub Pages Deployer
echo ======================================================
echo.

:: Ensure we are working from the repository root directory
cd /d "%~dp0"

:: 1. Check prerequisites
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not found in your PATH. Please install Git.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not found in your PATH. Please install Node.js.
    pause
    exit /b 1
)

:: 2. Check dependencies
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b %ERRORLEVEL%
    )
)

:: 3. Check for uncommitted changes on main
set HAS_CHANGES=0
for /f "delims=" %%i in ('git status --porcelain 2^>nul') do (
    set HAS_CHANGES=1
)

if "%HAS_CHANGES%"=="1" (
    echo [INFO] Uncommitted source code changes detected.
    echo.
    if "%~1"=="--quick" (
        set COMMIT_MAIN=N
    ) else if "%~1"=="-y" (
        set COMMIT_MAIN=Y
        set COMMIT_MSG=Update site
    ) else (
        set /p COMMIT_MAIN="Do you want to commit & push changes to 'main' branch first? (Y/N, default Y): "
        if "!COMMIT_MAIN!"=="" set COMMIT_MAIN=Y
    )

    if /i "!COMMIT_MAIN!"=="Y" (
        if "!COMMIT_MSG!"=="" (
            set /p COMMIT_MSG="Enter commit message (press Enter for 'Update site'): "
            if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update site
        )
        echo [GIT] Staging and committing changes...
        git add .
        git commit -m "!COMMIT_MSG!"
        echo [GIT] Pushing to main branch...
        git push origin main
        if %ERRORLEVEL% NEQ 0 (
            echo [WARNING] Pushing to main had issues, continuing to deploy...
        )
    )
)

:: 4. Build the production package
echo.
echo [1/2] Building production bundle (vite build)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please fix the errors above and try again.
    pause
    exit /b %ERRORLEVEL%
)

:: Ensure .nojekyll exists in dist
if not exist "dist\.nojekyll" (
    type nul > "dist\.nojekyll"
)

:: 5. Deploy to gh-pages branch
echo.
echo [2/2] Publishing to 'gh-pages' branch on GitHub...
call npx gh-pages -d dist --dotfiles -m "Deploy to GitHub Pages [skip ci]"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Publishing to gh-pages failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================
echo   DEPLOYMENT SUCCESSFUL!
echo ======================================================
echo   Repository: https://github.com/Magic-Embroidery/e-shopping
echo   Live URL:   https://magic-embroidery.github.io/e-shopping/
echo.
echo   Note: First-time setup on GitHub:
echo   1. Go to https://github.com/Magic-Embroidery/e-shopping/settings/pages
echo   2. Under 'Build and deployment' - Source: 'Deploy from a branch'
echo   3. Branch: 'gh-pages' / folder: '/ (root)' - Save
echo ======================================================
echo.

if not "%~1"=="--no-pause" (
    pause
)
exit /b 0
