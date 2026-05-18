@echo off
echo Cleaning up unwanted Neelveda files...
del /q /f "images\combo-3.png" 2>nul
del /q /f "images\combo-5.png" 2>nul
del /q /f "images\combo-10.png" 2>nul
del /q /f "images\fashion-combo-3.png" 2>nul
del /q /f "images\fashion-combo-5.png" 2>nul
del /q /f "images\fashion-combo-10.png" 2>nul
del /q /f "images\premium-bg.png" 2>nul
del /q /f "images\mobile-bg-3.png" 2>nul
del /q /f "images\mobile-bg-5.png" 2>nul
del /q /f "images\mobile-bg-10.png" 2>nul
rmdir /s /q "src" 2>nul
echo Cleanup complete!
(goto) 2>nul & del "%~f0"
