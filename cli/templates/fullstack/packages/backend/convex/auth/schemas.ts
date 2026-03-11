import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const userDataValidator = {
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
}

export const userDocumentValidator = {
  ...userDataValidator,
}

export const authTables = {
  users: defineTable(userDocumentValidator)
    .index('by_email', ['email']),
}
