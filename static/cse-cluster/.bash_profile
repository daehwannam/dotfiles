# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin

export PATH

# script commands
export PATH="/home/dhnam/script/common/command:$PATH"
export PATH="/home/dhnam/script/cse-cluster/command:$PATH"
