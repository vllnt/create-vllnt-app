import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  const content = await readFile(
    join(process.cwd(), '..', 'cli', 'llms.txt'),
    'utf-8',
  )
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
