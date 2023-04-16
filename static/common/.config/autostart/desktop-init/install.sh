#!/usr/bin/sh

echo "[Desktop Entry]
Name=Desktop Initialization
GenericName=Desktop initializer
Comment=It runs a script to initialize desktop environment
Exec=/home/${USER}/.config/autostart/desktop-init/run.sh
Terminal=false
Type=Application
X-GNOME-Autostart-enabled=true" > ~/.config/autostart/desktop-init.desktop
