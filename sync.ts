import syncMap from "./sync.config.ts"

import * as path from "node:path"
import * as os from "node:os"
import * as fs from "node:fs/promises"
import * as crypto from "node:crypto"
import chalk from "chalk"

/**
 * Creates or overwrites symlinks from this directory to the home directory based
 * on default export defined in `./sync.config`
 *
 * @note — this script has not been tested cross-platform, but
 * it works great on mac at least.
 */

process.on("uncaughtException", err => {
  console.error("Could not complete sync of dotfiles…", err.message)
  process.exit(1)
})

for (const { input, prefixWithDot = true, ...opts } of syncMap) {
  console.log(`Preparing to symlink ${chalk.blueBright(input)}…\n`)

  const res = await fs.access(input).catch(coerceError)

  if (res instanceof Error) {
    console.log(chalk.yellow(`\tInput file "${input}" not found. Skipping…\n`))
    continue
  }

  const inputDirectory = path.dirname(input)
  let inputFilename = path.basename(input)

  if (!inputFilename.startsWith(".") && prefixWithDot) {
    inputFilename = `.${inputFilename}`
  }

  const symlinkInput = path.resolve(input)

  const symlinkDestination = path.resolve(
    os.homedir(),
    ...(opts.output
      ? [opts.output]
      : [opts.keepPath ? inputDirectory : undefined, inputFilename].filter(
          e => typeof e === "string"
        ))
  )

  console.log(`\tLinking to ${symlinkDestination}…`)

  if (opts.dry) {
    console.log(chalk.dim("\tDry run, aborting… \n"))
    continue
  }

  const linkResult = await fs
    .symlink(symlinkInput, symlinkDestination)
    .catch(coerceError)

  let operation: "override" | "create" = "create"

  if (linkResult instanceof Error) {
    if ("code" in linkResult && linkResult.code === "EEXIST") {
      /**
       * create temporary symlink that overrides existing one through rename function.
       * Deleting and creating anew may break if other processes are currently using the files.
       * https://stackoverflow.com/a/34434957
       */
      const tempSiblingPath = createTempSiblingPath(symlinkDestination)

      await fs.symlink(symlinkInput, tempSiblingPath)
      await fs.rename(tempSiblingPath, symlinkDestination)

      operation = "override"
    } else {
      // Error is not one we account for, so forward it to the global exception handler
      throw linkResult
    }
  }

  console.log(
    chalk.bold.green(
      operation === "create"
        ? "\tSymlink successfully created"
        : "\tExisting symlink successfully overwritten"
    ),
    "\n"
  )
}

function coerceError(err: unknown): Error {
  if (err instanceof Error) {
    return err
  }

  return new Error(JSON.stringify(err, null, 2))
}

export function createTempSiblingPath(finalPath: string): string {
  const abs = path.resolve(finalPath)
  const id = createLowCollisionId()
  const { dir, name, ext } = path.parse(abs)

  return path.join(dir, `${name}.tmp.${id}.${ext}`)
}

function createLowCollisionId() {
  return crypto.randomBytes(6).toString("base64url")
}
