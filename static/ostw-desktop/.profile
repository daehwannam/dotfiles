# Sample .profile for SUSE Linux
# rewritten by Christian Steinruecken <cstein@suse.de>
#
# This file is read each time a login shell is started.
# All other interactive shells will only read .bashrc; this is particularly
# important for language settings, see below.

test -z "$PROFILEREAD" && . /etc/profile || true

# Some applications read the EDITOR variable to determine your favourite text
# editor. So uncomment the line below and enter the editor of your choice :-)
#export EDITOR=/usr/bin/vim
#export EDITOR=/usr/bin/mcedit

# For some news readers it makes sense to specify the NEWSSERVER variable here
#export NEWSSERVER=your.news.server

# Some people don't like fortune. If you uncomment the following lines,
# you will have a fortune each time you log in ;-)

#if [ -x /usr/bin/fortune ] ; then
#    echo
#    /usr/bin/fortune
#    echo
#fi

#
# [Start of added code by dhnam]
#

# app commands
export PATH="/home/dhnam/script/common/command:$PATH"
export PATH="/home/dhnam/script/desktop/command:$PATH"

# Micromamba setup
MAMBA_ROOT_PREFIX="$HOME/micromamba"
export WORKON_HOME="${MAMBA_ROOT_PREFIX}/envs"

export CONDA=micromamba  # anaconda3, miniconda3, micromamba or ...
export PATH="${MAMBA_ROOT_PREFIX}/envs/default/bin:$PATH"

# MEGA
if ! pgrep mega-cmd-server > /dev/null 2>&1
then
    nohup mega-cmd-server >/dev/null 2>&1 &
    # mega-sync /home/"$USER"/MEGA /MEGA 2>&1 &
fi
