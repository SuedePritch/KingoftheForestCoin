rsync -r src/ dist/
rsync build build/contracts/* dist/

git add .
git commit -m "Compiles files for DIST"
git push -u origin production