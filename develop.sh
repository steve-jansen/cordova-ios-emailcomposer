#!/bin/bash

# Name:    develop.sh
# Purpose: creates a cordova project using the EmailComposer plugin

readonly script_path=`cd ${0%/*} && echo $PWD`
readonly script_name=${0##*/}
readonly app_name=HelloCordova

pushd "$script_path" > /dev/null

if [ -d "./$app_name" ]
then
  rm -rf "./$app_name"
fi

which node >/dev/null 2>&1
if [ $? -ne 0 ]
then
  echo $script_name: node not installed, or not in PATH 
  exit 1
fi

which cordova >/dev/null 2>&1
if [ $? -ne 0 ]
then
  echo $script_name: cordova cli not installed, or not in PATH
  exit 2 
fi

dir=`mktemp -d /tmp/$app_name-XXXXX`
mkdir -p "$dir"

set -x # verbose, expand variables

cordova create "$dir"              || exit 3
pushd  "$dir" > /dev/null          || exit 4
cordova platforms add ios          || exit 5
cordova plugin add "$script_path"  || exit 6
cordova build                      || exit 7

#unset -x

popd >/dev/null
mv "$dir" "./$app_name"

open "./$app_name/platforms/ios/HelloCordova.xcodeproj"

exit 0
