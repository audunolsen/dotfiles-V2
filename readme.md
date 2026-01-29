## Rationale

Make it easy to start working on a new computer without spending time (repeatedly) configuring MY (and maybe yours?) most reached for technologies. For me, that is node, deno, shell config, misc editor configs, etc…

### Roadmap

- Sync (symlink) script ✅
  - global vscode settings ✅
  - global (ish) prettier config ✅
  - global editorconfig ✅
  - zshrc ✅
  - gitconfig ✅

- Portable sync executable. Without it, `node`, `npm` and dependency installation are all necessary before syncing can occur

- asdf as a submodule. This will install it when cloning this repo.
  - tool install script
    - parse .tool-versions to determine what plugins to install
    - install tools based on .tool-versions

<!-- Key functionality include the fastest possible way to download your tools, and a way to sync (symlink) your chosen dotfiles to the home repo for them to take effect. -->

<!-- ### 1. Clone this repo

Mac, at least, comes with git installed.

### 2. Download tools (todo/wip)

This actually uses asdf through git submodules, such that you don't need to install it explcitly. This means you only need to run

`asdf install` -->
