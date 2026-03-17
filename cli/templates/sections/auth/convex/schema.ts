import { defineSchema } from 'convex/server'
import { authTables } from './auth/schemas'

export default defineSchema({
  ...authTables,
})
