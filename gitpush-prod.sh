git add .

echo 'Enter the commit message:'
read commitMessage

git commit -m "$commitMessage"

git checkout master

git push origin master

read