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

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```
