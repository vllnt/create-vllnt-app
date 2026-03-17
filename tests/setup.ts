import { afterAll } from 'vitest'
import { cleanTestRoot } from './helpers/tmp.js'

afterAll(async () => {
  await cleanTestRoot()
})
