#!/bin/bash

THIS_PATH=`realpath $0`
DIR_PATH=`dirname $THIS_PATH`

ARGS=$1
OPTIONS_FILE_PATH=$DIR_PATH/options.txt

touch -a $OPTIONS_FILE_PATH

options=$(cat $OPTIONS_FILE_PATH)

for option in $options
do
    stow $ARGS -t ~ -d $DIR_PATH $option
done
