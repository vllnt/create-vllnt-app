import { internalMutation } from '../_generated/server'
import { v } from 'convex/values'

export const upsertUser = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id('users'),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        imageUrl: args.imageUrl,
      })
      return existing._id
    }

    return await ctx.db.insert('users', {
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      role: 'user',
    })
  },
})
