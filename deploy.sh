git checkout deployment &&
git reset main --hard &&
yarn tsc &&
yarn vite build &&
sed -i.bak 's/assets/spotLabel\/assets/' ./dist/index.html &&
mkdir ./dist/accept &&
cp ./dist/index.html ./dist/accept &&
mv ./dist/* ./ &&
git add . &&
git commit -m 'deploy' &&
git push -f
git checkout main
