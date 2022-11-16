#!/usr/bin/sh

# THIS_PATH=`realpath $0`
# DIR_PATH=`dirname $THIS_PATH`

DIR_PATH=~/.dotfiles/static/gsai-cluster/module

source $DIR_PATH/unload-cuda.sh
module load cuda/10.2 nccl/cuda/10.2/2.8.3 cuDNN/cuda/10.2/8.1.0.77
