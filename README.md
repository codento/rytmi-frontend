# Rytmi Frontend

## Git Workflow

```bash
git checkout dev
git checkout -b feature-branch
# do your job
git push -U origin feature-branch
# When done with the feature create a pull request to the dev branch at github.
# Someone merges the PR.

# When time to release.
# Bump version in package 

git checkout dev
# bump 

```

## Project setup

**Environment variables**
Vue uses a public and local `env` files. Local/secret files must have a `.local` postfix.  
Create a `.env.local` file with your secrets. You can use `.env.local.example` as a sample.

```
yarn install

yarn serve
```

## Editing Environment variables
If you modify the secret files those must be encrypted first. See https://docs.travis-ci.com/user/encrypting-files/ for more information.  
Travis CLI must be installed first. https://github.com/travis-ci/travis.rb#installation

```bash
tar cvf secrets.tar .env.local .env.*.local
travis encrypt-file secrets.tar --add

git add secrets.tar.enc .travis.yml
git commit -m 'use secret archive'
git push
```
