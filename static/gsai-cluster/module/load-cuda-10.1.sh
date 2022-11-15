#!/usr/bin/sh

# THIS_PATH=`realpath $0`
# DIR_PATH=`dirname $THIS_PATH`

DIR_PATH=/home/dhnam/script/gsai-cluster/module

source $DIR_PATH/unload-cuda.sh
module load cuda/10.1 nccl/cuda/10.1/2.8.3 cuDNN/cuda/10.1/7.6.4.38
