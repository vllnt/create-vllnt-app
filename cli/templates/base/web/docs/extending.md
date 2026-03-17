# Extending {{projectName}}

## Adding Features with CLI

```bash
vllnt add auth          # BetterAuth + Convex integration
vllnt add payments      # Stripe + Convex integration
vllnt add analytics     # Analytics integration

vllnt generate feature {name}    # New feature slice
vllnt generate page {name}       # New page with layout
vllnt generate domain {name}     # New Convex domain
vllnt generate component {name}  # New shared component
vllnt generate hook {name}       # New custom hook
```

## Manual Feature Addition

### 1. Create Feature Slice

```
features/{name}/
  components/       Feature-specific UI
  hooks/            Feature-specific hooks
  index.ts          Public API
```

### 2. Create Convex Domain

```
convex/{name}/
  schemas.ts        Table definition + validators
  queries.ts        Read functions
  mutations.ts      Write functions
```

### 3. Register Schema

Add table import to `convex/schema.ts`:

```typescript
import { myTable } from './{name}/schemas'

export default defineSchema({
  ...authTables,
  myTable,
})
```

### 4. Add Page

Create `app/[locale]/(group)/{route}/page.tsx` and add translations to `messages/en.json`.

## Adding Convex Components

Register third-party Convex components in `convex/convex.config.ts`:

```typescript
import { defineApp } from 'convex/server'
import myComponent from '@convex-dev/my-component/convex.config'

const app = defineApp()
app.use(myComponent)
export default app
```

## Environment Variables

- Next.js: `.env.local` for `NEXT_PUBLIC_*` and server-side vars
- Convex: Set via Convex dashboard or `npx convex env set KEY value`
