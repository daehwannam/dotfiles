#!/usr/bin/sh

# THIS_PATH=`realpath $0`
# DIR_PATH=`dirname $THIS_PATH`

DIR_PATH=~/.dotfiles/static/gsai-cluster/module

MODULE_AV_OUT=$DIR_PATH/av.out

if [ ! -f $MODULE_AV_OUT ]
then
    module av > $MODULE_AV_OUT
fi

# module unload $(module av | grep -o 'cuda/[^ ]*' | tr '\n' ' ')
module unload $(cat $MODULE_AV_OUT | grep -o 'cuda/[^ ]*' | tr '\n' ' ')
module unload $(cat $MODULE_AV_OUT | grep -o 'nccl/cuda/[^ ]*' | tr '\n' ' ')
module unload $(cat $MODULE_AV_OUT | grep -o 'cuDNN/cuda/[^ ]*' | tr '\n' ' ')
