git add .

echo 'Enter the commit message:'
read commitMessage

git commit -m "$commitMessage"

git checkout dev

git push origin dev

read