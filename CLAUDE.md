# Shopping List App

React + Firebase shopping list with integrated meal planner. Mobile-first, single shared-password auth (household use — do not add multi-user auth).

## Firebase Setup

Copy `.env.example` to `.env` and fill in all `VITE_FIREBASE_*` values from the Firebase console, plus `VITE_APP_PASSWORD`.

Firestore collections:
- `items` — `{ text, itemType ('normal'|'meal'), category, order, createdAt, ticked?, mealSources? }`
- `meals` — `{ name, ingredients: [{name, quantity, unit, category}], photoURL?, createdAt }`

Meal photos are stored in Firebase Cloud Storage under `meal-photos/<docId>`. Firestore and Storage security rules live in the Firebase console, not in this repo.

## Category Detection (`src/utils/categories.js`)

Detection runs in a fixed priority order — **do not reorder** without thinking through conflicts:

1. `pet_supplies` → `cleaning` → `personal_care` (checked first to avoid false positives — e.g. "dog shampoo" must hit pet before personal care)
2. `frozen` → `canned` → `herbs_spices` → `beverages`
3. `veg` → `seafood` → `meat` → `dairy` → `bakery` → `snacks`
4. Falls back to `other`

To add a new category: add it to `CATEGORIES` with `order`, add a keyword list constant, and insert it at the right priority position in `detectCategory()`.

## Ingredient Merging (Checkout Flow)

`stackIngredients()` in `MealPlanner.jsx` merges ingredients across selected meals by `name.toLowerCase() + unit` key, summing quantities and collecting `mealSources`.

During checkout, if a meal item with the same ingredient name+unit already exists in Firestore, it parses the text format `"Name (quantityunit)"` and merges rather than duplicating. This regex-based parse in `handleCheckout` is the fragile part — the text format and the parse must stay in sync.

## Auth

Password check uses `sessionStorage` (clears on tab close). The password is a single shared value from `VITE_APP_PASSWORD`. This is intentional for household use.

## Push Notifications (Checkout only)

When a checkout completes, `MealPlanner` writes a document to the `checkouts` Firestore collection. A Cloud Function (`functions/index.js`) triggers on that write, fans out FCM push notifications to all stored device tokens except the sender's, then deletes the checkout document.

**Firestore collections added:**
- `tokens`: `{ token: string, updatedAt: number }` — one doc per device, ID stored in `localStorage('fcm_doc_id')`
- `checkouts`: `{ mealNames: string[], senderToken: string|null, timestamp: number }` — ephemeral, deleted by the function after processing

**Setup steps (one-time):**
1. Fill in `public/firebase-messaging-sw.js` with the actual Firebase config values (copy from `.env`)
2. Add `VITE_FIREBASE_VAPID_KEY` to `.env` — generate the key at Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
3. `cd functions && npm install`
4. `firebase use --add` (select your Firebase project), then `firebase deploy --only functions`

The service worker uses the Firebase compat CDN (v10.14.1) — it doesn't go through Vite so env vars can't be injected; the config must be hardcoded in that file. The config is not secret (it's already in the client JS bundle).
