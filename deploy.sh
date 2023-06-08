yarn tsc
yarn vite build
sed -i.bak 's/assets/spotLabel\/assets/' ./dist/index.html
mkdir ./dist/accept
cp ./dist/index.html ./dist/accept
mv ./dist/* ./
git commit . -m 'deploy'
git push -f
