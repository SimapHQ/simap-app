#!/bin/bash
set -eux

PAGES_BRANCH="gh-pages"
COMMIT_MESSAGE="Food Storage Tracker v$1"

echo "Building production files"
grunt build

echo "Moving files to /tmp"
rm -rf /tmp/dist
mv dist /tmp

echo "Switching to ${PAGES_BRANCH} branch"
git checkout --orphan gh-pages

echo "Removing all files from working tree"
rm -rf /tmp/node_modules /tmp/bower_components
mv node_modules bower_components /tmp
rm -rf *
git rm -rf .

echo "Adding files from /tmp/dist"
cp -R /tmp/dist/* .
rm -rf /tmp/dist

echo "Committing with message ${COMMIT_MESSAGE}"
git add .
git commit -m "${COMMIT_MESSAGE}"

echo "Pushing to GitHub"
git push origin gh-pages

echo "Switching back to master branch"
git checkout master

echo "Replacing dependencies"
mv /tmp/node_modules /tmp/bower_components .

echo "Deploy of ${COMMIT_MESSAGE} complete!" 
