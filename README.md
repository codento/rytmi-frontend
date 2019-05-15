# Rytmi Frontend


## Project setup

Make first sure env variables are all set. See next sub section.

```
npm install
npm run serve
```

### Environment variables

Vue uses a public and local `.env` files. Local/secret files must have a `.local` postfix.  
Create a `.env.development.local` file with your secrets. You can use `.env.local.example` as a sample.
Vue only loads ENV variables that have VUE_APP prefix.

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

**Editing Environment variables**  
If you modify the secret files those must be encrypted first. See https://docs.travis-ci.com/user/encrypting-files/ for more information. Use the --org paramater for travis login!    
Travis CLI must be installed first. https://github.com/travis-ci/travis.rb#installation

Add deploy_rsa to the packet. Travis uses it for deployment purposes.

```bash
tar cvf secrets.tar .env.local .env.*.local deploy_rsa
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

### VS Code Settings
Install extensions
- Vetur
- Eslint
- EditorConfig for VS Code

Add to User/Workspace settings
```json
"eslint.validate": [
    "javascript",
    "javascriptreact",
    {
        "language": "vue",
        "autoFix": true
    },
],
"vetur.validation.template": false,
"vetur.format.defaultFormatter.js": "vscode-typescript",
"javascript.format.insertSpaceBeforeFunctionParenthesis": true
```


## Git Workflow
This repo has a dev (default) and a master branch. New features are developed in a feature branch branched off from the dev branch. Feature branches are merged back to the dev branch. The only commits to the master branch should be merged from release or hotfix branches.

Dev branch is auto deployed to the staging server and master branch to the production server.

### Making a new release
 Create a new feature branch from dev.
```bash
git checkout dev
git pull
git checkout -b feature-branch
# Do your stuff
git push -u origin feature-branch
# When done with the feature create a pull request to the dev branch at github
# Someone merges the PR
```
After the feature branch is merged to dev, check that everything works in staging environment: s.rytmi.codento.com

Versions follow semantic versioning (https://semver.org/):
* MAJOR.MINOR.PATCH
* MAJOR version when you make incompatible API changes,
* MINOR version when you add functionality in a backwards-compatible manner, and
* PATCH version when you make backwards-compatible bug fixes.

Create a new release branch from dev with a new version number (release-X.Y). Version number of the application (found in package.json file) is updated in the release branch with a separate commit. It is also possible to fix bugs in the release branch at this stage.
```bash
git checkout dev
git pull
git checkout -b release-X.Y
# bump new version in package.json, then:
git add package.json
git commit -m "Bump version to X.Y.0"
git push -u origin release-X.Y

# Make a pull request from release-X.Y to master
# Merge the PR
# Make a tag and release in Github (see section below: Tagging)

# Finally make a pull request from release-X.Y to dev and merge the PR
```

#### Tagging
After the release branch is succesfully merged to master and the new version is running in production, tag the latest commit in master with the new version number. Annotate the tag with "Release X.Y.Z"
```bash
# Checkout to the latest commit in master
git checkout 283ab30

# The following step is optional: temporarily set the date to the date of the HEAD commit
# This is needed when tag is created later than the actual commit was made
GIT_COMMITTER_DATE="$(git show --format=%aD | head -1)"
# Add the tag
git tag -a 3.1.0 -m"Release 3.1.0"

# Tags need to be pushed separately, use --no-verify to skip tests (as no files have been changed)
git push origin 3.1.0 --no-verify

# Set HEAD back to where you want
git checkout dev
```

### Making a hotfix
```bash
git checkout release-X.Y
git checkout -b hotfix-X.Y.Z

# Fix issues, then:
gid add edited_files
git push -u origin hotfix-X.Y.Z

# Make a pull request from hotfix-X.Y.Z to release-X.Y.
# Merge the PR.
# Follow steps described in Making a new release
```
