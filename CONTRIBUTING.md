# Contributing

When contributing to this repository, please first discuss the change you wish to make via an existing relevant issue or by opening a new issue. This will allow people working on the same or overlappign features to be aware of each other's intentions, and maybe work together on the pull request.

To contribute, fork the project and make a new branch for each feature/bug fix you would like to contribute. Then, submit a pull request following the guidelines below.

## Pull Request Guidelines

1. Pull requests should be made against the relevant feature branch if it exists, or to the appropriate `*-dev` branch (see description below) if no relevant feature branch exists. Do not use the `master` branch as base for pull requests and avoid using the `dev` branch directly unless previously discussed.

2. Each pull request should contain a single feature/bug fix/contribution.

3. Be mindful of caching via service workers. Increase versions when appropriate.

4. If your pull request is related to an existing pull request or an issue, reference the issue or pull request as part of your PR message (see [how to do this](https://help.github.com/articles/autolinked-references-and-urls/))


## Branch Description

* `server-dev`: is the development branch for server-side features.

* `game-dev`: is the development branch for game features.

* `dev`: is the main development branch to serve as a staging area for integration testing of the `server-dev` and `game-dev` branches.

* `master`: is the main branch, and should contain the latest code that is considered stable.