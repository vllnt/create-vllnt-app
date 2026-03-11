import { execaNode } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import os from 'node:os'

const CLI_PATH = path.resolve(__dirname, '../../cli/dist/index.js')

interface RunResult {
  stdout: string
  stderr: string
  exitCode: number
}

interface RunOptions {
  cwd?: string
  env?: Record<string, string>
  timeout?: number
}

export async function runCli(
  args: string[],
  options: RunOptions = {},
): Promise<RunResult> {
  const { cwd, env, timeout = 30_000 } = options

  try {
    const result = await execaNode(CLI_PATH, args, {
      cwd,
      timeout,
      env: { ...process.env, ...env, NO_COLOR: '1' },
      reject: false,
    })

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode ?? 0,
    }
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; exitCode?: number }
    return {
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? '',
      exitCode: err.exitCode ?? 1,
    }
  }
}

export async function createTmpDir(prefix = 'vllnt-test-'): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix))
  return dir
}

export async function cleanTmpDir(dir: string): Promise<void> {
  await fs.remove(dir)
}

export function parseJsonOutput(stdout: string): unknown {
  const lines = stdout.trim().split('\n')
  const jsonLine = lines.find((line) => line.startsWith('{'))
  if (!jsonLine) {
    throw new Error(`No JSON found in output:\n${stdout}`)
  }
  return JSON.parse(jsonLine)
}

export function fileExists(dir: string, ...segments: string[]): boolean {
  return fs.existsSync(path.join(dir, ...segments))
}

export function readFile(dir: string, ...segments: string[]): string {
  return fs.readFileSync(path.join(dir, ...segments), 'utf-8')
}

export function countLines(content: string): number {
  return content.split('\n').length
}

export function listFiles(dir: string): string[] {
  const files: string[] = []
  function walk(current: string, prefix = ''): void {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), relative)
      } else {
        files.push(relative)
      }
    }
  }
  walk(dir)
  return files.sort()
}
