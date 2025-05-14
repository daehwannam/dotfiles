#!/bin/bash

THIS_PATH=`realpath $0`
DIR_PATH=`dirname $THIS_PATH`

ARGS=$1
PROFILE_PATH_FILE_PATH=$DIR_PATH/profile-path.txt

touch -a $PROFILE_PATH_FILE_PATH

profile_path=$(cat $PROFILE_PATH_FILE_PATH)

if [ -z "${profile_path}" ]; then
    echo "The profile path should be specified in \"$PROFILE_PATH_FILE_PATH\"."
    echo 'Open URL "about:profiles" to check the path.'
    exit 1
fi


stow $ARGS -t $profile_path -d $DIR_PATH profile-config-betterfox
# echo "stow $ARGS -t $profile_path -d $DIR_PATH profile-config-betterfox"
