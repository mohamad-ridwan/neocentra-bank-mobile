# tech & framework :
- React Native dengan Expo

# styles dan ui component :
- NativeWind v4 (sebagai utility class)
- gluestack-ui v4 (sebagai ui component)
- lucide-react-native (sebagai icon component)

# fitur saat ini :
- login page (untuk akun masuk yang sudah terdaftar di db aplikasi)
- register page (untuk daftar akun sebagai pengguna sebagai calon hak akses aplikasi)

# form validation
- Zod

# state management :
- Zustand (untuk proses client state (global), seperti logic ui yang complex), untuk mempercepat proses development dibandingkan redux toolkit
- TanStack Query (untuk proses state data yang bersifat async dari server APIs)

# design pattern :
- domain-driven design (DDD) concepts

# struktur direktori :
Struktur direktori berbasis **Domain-Driven Design (DDD) concepts** yang disesuaikan untuk React Native / Expo Router, TanStack Query, Zustand, Zod, NativeWind v4, dan Gluestack UI v4:

```text
src/
├── app/                        # Expo Router Pages / Navigation Routing (Presentation Layer Entry)
│   ├── (auth)/                 # Auth route group
│   │   ├── login.tsx           # Page / Screen Entry Point Login
│   │   └── register.tsx        # Page / Screen Entry Point Register
│   ├── _layout.tsx             # Root layout with providers (TanStack Query, Gluestack UI)
│   └── index.tsx               # Entry / Splash / Redirect
│
├── modules/                    # Sub-domains / Bounded Contexts (DDD Core Modules)
│   ├── auth/                   # Bounded Context: Authentication
│   │   ├── domain/             # Core Business Logic & Enterprise Rules (Pure JS/TS, UI-agnostic)
│   │   │   ├── entities/       # Domain Models / User Entity & Interfaces
│   │   │   │   └── user.entity.ts
│   │   │   └── schemas/        # Business / Form Validations using Zod
│   │   │       ├── login.schema.ts
│   │   │       └── register.schema.ts
│   │   │
│   │   ├── application/        # Application Logic & State Management
│   │   │   ├── store/          # Client-side UI / Session State (Zustand)
│   │   │   │   └── useAuthStore.ts
│   │   │   └── queries/        # Server State / Async Queries & Mutations (TanStack Query)
│   │   │       ├── useLoginMutation.ts
│   │   │       └── useRegisterMutation.ts
│   │   │
│   │   ├── infrastructure/     # Data Layer / External Communication APIs
│   │   │   ├── api/            # API Endpoints & Axios/Fetch Service Callers
│   │   │   │   └── auth.api.ts
│   │   │   └── mappers/        # DTO to Domain Entity Mappers
│   │   │       └── user.mapper.ts
│   │   │
│   │   └── presentation/       # Domain-Specific UI Components & Screens
│   │       ├── components/     # Specific Components for Auth Domain (Form Input, Social Buttons)
│   │       │   ├── LoginForm.tsx
│   │       │   └── RegisterForm.tsx
│   │       └── screens/        # Screen Container Views
│   │           ├── LoginScreen.tsx
│   │           └── RegisterScreen.tsx
│   │
│   └── [future-domain]/        # (e.g. transfer, account, transaction - scalable for future features)
│
├── shared/                     # Shared kernel across all domains
│   ├── components/             # Reusable UI Components (Gluestack UI, Custom Buttons, Inputs)
│   │   └── ui/
│   ├── hooks/                  # Custom Global Utility Hooks
│   ├── infrastructure/         # Shared Network Client (HTTP Client / Axios Instance / Storage)
│   │   └── http-client.ts
│   ├── styles/                 # Global Styles & NativeWind Config
│   │   └── global.css
│   └── utils/                  # Helper functions & formatters
```

# package.json :
struktur package.json yang saat ini digunakan :
```text
{
  "name": "neocentra-bank-mobile",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.11",
    "@tanstack/react-query": "^5.59.0",
    "axios": "^1.7.7",
    "clsx": "^2.1.1",
    "expo": "~57.0.14",
    "expo-constants": "~57.0.12",
    "expo-dev-client": "~57.0.14",
    "expo-device": "~57.0.1",
    "expo-font": "~57.0.1",
    "expo-glass-effect": "~57.0.1",
    "expo-image": "~57.0.3",
    "expo-linking": "~57.0.6",
    "expo-router": "~57.0.14",
    "expo-splash-screen": "~57.0.7",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.2",
    "expo-system-ui": "~57.0.2",
    "expo-web-browser": "~57.0.2",
    "lucide-react-native": "^0.453.0",
    "nativewind": "^4.1.23",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.2",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-mmkv": "^4.3.2",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "^15.8.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "tailwindcss": "^3.4.14",
    "typescript": "~6.0.3"
  },
  "overrides": {
    "lucide-react-native": {
      "react": "$react"
    }
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}
```