#!/usr/bin/env bash

sudo localectl set-keymap kr
# printf "keycode 58 = Control\nkeycode 29 = Caps_Lock\n" | sudo loadkeys
printf "keycode 58 = Control\nkeycode 58 = Control\nshift keycode 58 = Control\naltgr keycode 58 = Control\ncontrol keycode 58 = Control\nkeycode 29 = Caps_Lock\n" | sudo loadkeys
