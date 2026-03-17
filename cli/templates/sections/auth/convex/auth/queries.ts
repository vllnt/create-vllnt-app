import { query } from '../_generated/server'
import { v } from 'convex/values'

export const getUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      email: v.string(),
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email!))
      .first()

    return user
  },
})

export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      email: v.string(),
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      role: v.optional(v.union(v.literal('user'), v.literal('admin'))),
    }),
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50
    return await ctx.db.query('users').take(limit)
  },
})
