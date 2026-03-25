import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

let testRoot: string | undefined

export async function getTestRoot(): Promise<string> {
  if (!testRoot) {
    const suffix = process.env.VITEST_WORKER_ID ?? process.pid.toString()
    testRoot = await fs.mkdtemp(path.join(os.tmpdir(), `vllnt-tests-${suffix}-`))
  }
  return testRoot
}

export async function cleanTestRoot(): Promise<void> {
  if (testRoot) {
    await fs.remove(testRoot)
    testRoot = undefined
  }
}
