# Rytmi Frontend

## Workflow

We'll follow Git Flow branching model. Read more at https://leanpub.com/git-flow/read.

In summary:
```bash
git checkout dev
git checkout -b feature-branch
# do your job
git push -U origin feature-branch
# When done with the feature create a pull request to the dev branch at github.
# Someone merges the PR.

# In time of release do a release branch.
git checkout dev
git checkout -b release-vX.Y.Z
# Bump the version number in package.json
git push -U origin release-vX.Y.Z

git checkout dev
git merge release-vX.Y.Z

git checkout master
git merge release-vX.Y.Z
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
