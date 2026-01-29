export default defineSyncMap([
  { input: "zsh/zshrc" },
  { input: "git/gitconfig" },
  { input: ".tool-versions" },
  { input: "prettier.config.ts", prefixWithDot: false },
  { input: "vscode/editorconfig" },
  {
    input: "vscode/user-settings.json",
    output: "Library/Application Support/Code/User/settings.json"
  }

  // Tests…
  // { input: "symlink-test/test.txt", dry: true },
  // { input: "symlink-test/test.txt", dry: true, keepPath: true },
  // {
  //   input: "symlink-test/test.txt",
  //   dry: true,
  //   keepPath: true,
  //   prefixWithDot: false
  // },
  // { input: "non-existant-file-test" }
])

function defineSyncMap(
  map: Array<{
    /**
     * The input file. Will throw if not found.
     * Will symlink file to relative to home directory.
     * Does not include the path of the file, reason being
     * that most dotfiles are relative to the home directory and
     * seldomly in any nested subdirectory.
     *
     * Will also prefix file with dot when creating the symlink unless
     * explcitly configured not to, or if the file already has one. This,
     * at least in my opinion, communicates clearly that you are just working
     * on the file in this context, and that it doesn't have any effect as
     * opposed to the symlinked one.
     */
    input: string

    /**
     * Provide explicit path of symlink target. If omitted then the symlink path will
     * fill back to behavours described in the `input` property.
     */
    output?: string

    /** @default {true} */
    prefixWithDot?: boolean

    /** @default {false} */
    keepPath?: boolean

    /**
     * Dry run for testing purposes, to see what the log outputs.
     *
     * @default {false}
     */
    dry?: boolean
  }>
) {
  return map
}
