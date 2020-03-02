## A risd.systems powered website.

### To contribute

1. Clone the repository
2. `npm install` from within the cloned directory to install dependencies
3. `npm run configuration` to write out the site configuration file (`.firebase.conf`).
4. `npm start` to start the development process.
5. With the development process running, make changes to the templates, javascript, or scss.
6. stop the development process when ready to commit changes.
7. `git commit` the changes made to the repository
8. `git push` the changes made to github
9. `npm run deploy` to deploy the site changes to the site bucket that is configured for the current branch.

### Deploy configuration

To view site bucket & git branch configuration, run `npx rm-wh deploys`.

To add a site bucket for the current branch, run `npx rm-wh deploys:set {bucket-name}` where `{bucket-name}` should be replaced with the bucket to be added for the current branch.

To remove a site bucket for the current branch, run `npx rm-wh deploys:remove {bucket-name}` where `{bucket-name}` should be replaced with the bucket to be removed for the current branch.

Use the optional `--branch` to set deploy configuration for a specific branch, not necessarily the one you are on. For example, `npx rm-wh deploys:remove {bucket-name} --branch=feature/completed-feature` will remove `{bucket-name}` from being a configured deploy destination for the `feature/completed-feature` branch.
