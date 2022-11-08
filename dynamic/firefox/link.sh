#!/bin/bash

THIS_PATH=`realpath $0`
DIR_PATH=`dirname $THIS_PATH`

ARGS=$1
PROFILE_PATH_FILE_PATH=$DIR_PATH/profile-path.txt

touch -a $PROFILE_PATH_FILE_PATH

profile_path=$(cat $PROFILE_PATH_FILE_PATH)

stow $ARGS -t $profile_path -d $DIR_PATH profile-config
