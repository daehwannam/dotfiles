# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions

# My configuraiton

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/dhnam/program/miniconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/dhnam/program/miniconda3/etc/profile.d/conda.sh" ]; then
        . "/home/dhnam/program/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/dhnam/program/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

# disable activating 'base'
# https://stackoverflow.com/a/54560785
conda config --set auto_activate_base false  # it creates "~/.condarc"

# activate 'default' environment
conda activate default

# alias emacs='emacs -nw'
