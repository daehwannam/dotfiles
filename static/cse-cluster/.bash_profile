# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/.local/bin:$HOME/bin

export PATH

# My configuraiton
CONDA=miniconda3  # anaconda3 or miniconda3 or ...
export PATH="/home/dhnam/program/$CONDA/envs/default/bin:$PATH"

# script commands
export PATH="/home/dhnam/script/common/command:$PATH"
export PATH="/home/dhnam/script/cse-cluster/command:$PATH"
export PATH="/home/dhnam/script/slurm/command:$PATH"
