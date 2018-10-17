# Rytmi Frontend


## Project setup

Make first sure env variables are all set. See next sub section.

```
yarn install

yarn serve
```

### Environment variables

Vue uses a public and local `.env` files. Local/secret files must have a `.local` postfix.  
Create a `.env.development.local` file with your secrets. You can use `.env.local.example` as a sample.

**Editing Environment variables**  
If you modify the secret files those must be encrypted first. See https://docs.travis-ci.com/user/encrypting-files/ for more information.  
Travis CLI must be installed first. https://github.com/travis-ci/travis.rb#installation

```bash
tar cvf secrets.tar .env.local .env.*.local
travis encrypt-file secrets.tar

# copy decryption command from the previous command output to the .travis.yml

git add secrets.tar.enc .travis.yml
git commit -m 'update secret archive'
git push
```

## Coding style

**EsLint**  
For JavaScript we are using currently JavaScript Standard Style https://standardjs.com/.  
For Vue specific styling we use quite strict `vue/recommended` mode.

**.editorconfig**  
Make sure your editor supports `.editorconfig` or follow rules on your own.

## Git Workflow

This repo has a dev (default) and a master branches. All features are developed in a feature branch and merged to the dev branch.

Dev-branch is auto deployed to the staging server and master branch to the production server.

```bash
git checkout dev
git checkout -b feature-branch
# do your job
git push -U origin feature-branch
# When done with the feature create a pull request to the dev branch at github.
# Someone merges the PR.

# When time to release.
git checkout dev
# bump version in package.json
git add package.json
git commit -m "bump version"
git push

# Make a pull request from dev to master.
# Merge the PR.
# Make a tag and release in Github.
```

