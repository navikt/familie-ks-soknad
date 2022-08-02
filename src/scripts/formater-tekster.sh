#!/usr/bin/env bash

set -e

if [[ $# -eq 0 ]]; then
    echo "Du må angi mappe der språkfilene ligger"
    exit 1
fi

langdir=$1

# OS X har en annen sed enn linux/windows, så klart.
if [[ "$(uname)" = "Darwin" ]]; then
    sedi=(-i '' -E)
else
    sedi=(-i -E)
fi

cd $langdir

echo "Removing newlines"
find . -type f -exec sed "${sedi[@]}" s_\\\\n_\ _g {} \;
echo "Removing excessive whitespace"
find . -type f -exec sed "${sedi[@]}" s_\ \ \+_\ _g {} \;
echo "Removing trailing whitespace"
find . -type f -exec sed "${sedi[@]}" s_\ \+\",_\",_g {} \;
echo "Removing nonstandard apostrophes"
find . -type f -exec sed "${sedi[@]}" s_’_\'_g {} \;

echo "Reindenting files"
find . -type f -exec bash -c 'python3 -m json.tool --indent 2 --no-ensure-ascii $1 tmpfile && mv tmpfile $1' find-sh {} \;