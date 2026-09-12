# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile; for setting the umask
# for ssh logins, install and configure the libpam-umask package.
#umask 022

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

# script commands
export PATH="$HOME/script/common/command:$PATH"
# export PATH="$HOME/script/gsai-cluster/command:$PATH"
export PATH="$HOME/script/slurm/command:$PATH"

# Micromamba setup
MAMBA_ROOT_PREFIX="$HOME/program/micromamba"
export WORKON_HOME="${MAMBA_ROOT_PREFIX}/envs"

export CONDA=micromamba  # anaconda3, miniconda3, micromamba or ...
export PATH="${MAMBA_ROOT_PREFIX}/envs/default/bin:$PATH"
