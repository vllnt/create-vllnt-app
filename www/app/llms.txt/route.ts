import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/naming-convention -- Next.js route handler convention
export async function GET(): Promise<NextResponse> {
  const content = await readFile(
    join(process.cwd(), '..', 'cli', 'llms.txt'),
    'utf8',
  )
  return new NextResponse(content, {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP header
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
