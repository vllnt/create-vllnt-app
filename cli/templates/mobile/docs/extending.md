# Extending {{projectName}}

## Adding Features with CLI

```bash
vllnt add auth          # BetterAuth + Convex integration
vllnt add payments      # Stripe + Convex integration
vllnt add analytics     # Analytics integration

vllnt generate feature {name}    # New feature slice
vllnt generate screen {name}     # New Expo Router screen
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

Add table import to `convex/schema.ts`.

### 4. Add Screen

Create `app/(group)/{name}.tsx` and add translations to `i18n/locales/en.json`.

## Adding Native Modules

Install via expo:

```bash
npx expo install expo-camera
npx expo install expo-location
```

Config plugins go in `app.json` under `plugins`.

## EAS Build

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

## Environment Variables

- Expo: prefix with `EXPO_PUBLIC_` in `.env`
- Convex: set via dashboard or `npx convex env set KEY value`
