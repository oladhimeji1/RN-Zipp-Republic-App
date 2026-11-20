# Zipp Republic: React Native (Expo) store app

Dummy-data ecommerce app inspired by a Flutter sneaker-app screen recording, rebuilt around the
Zipp Republic brand (shopzipprepublic.com): black and white, red accent, Archivo + DM Serif italic,
"Luxury & Lifestyle", marquee tickers, Naira pricing, the real collections (Men, Women, Tshirts,
Jackets & Hoodies, Accessories, Slides).

## Run it

### Option A: new project
```bash
npx create-expo-app@latest zipp --template default
cd zipp
# delete the template's src/ folder, then copy this project's src/ and app.json over it
npx expo install expo-linear-gradient expo-haptics expo-blur zustand \
  @react-native-async-storage/async-storage @expo-google-fonts/archivo \
  @expo-google-fonts/dm-serif-display @expo/vector-icons \
  react-native-reanimated react-native-gesture-handler react-native-safe-area-context \
  expo-image expo-font expo-splash-screen expo-router
npx expo start
```

### Option B: your existing SDK 57 project
Copy `src/` in, make sure tsconfig has `"paths": { "@/*": ["./src/*"] }` and
`"main": "expo-router/entry"`, run the same `npx expo install ...` line, then `npx expo start -c`.

## Flow (mapped from the video, rebranded)
Splash (animated ✱ + wordmark) → Welcome (Ken Burns hero, Sign up / Sign in) → Create account
(validation, success sheet) → Greeting → Personalise (3 steps, skippable) → Tabs
(Home, Shop, Saved, Bag, Profile) → Collection → Product → Bag → Checkout (3 steps) → Order success → Orders / tracking.

## Extra ecommerce pieces added beyond the video
Sign in, forgot password, search with recents, sort + gender filters, wishlist, product variants
(swatches drive the image carousel), size guide, promo codes (`ZIPP10`, `REPUBLIC15`), free-delivery
progress bar, address book, delivery + payment steps (simulated), order history with a live-advancing
tracker, reorder, size preferences, persisted state (AsyncStorage).

## Dummy data
Everything lives in `src/lib/data.ts`. Product photos use the storefront CDN URLs; jewelry and hats have
no photos and render a designed placeholder tile. Replace `image` fields to swap in your own.
