implementasikan arsitektur mobile app (frontend) berikut ini :

# tech & framework yang sudah di install :
- React Native dengan Expo

# konfigurasi styles dan ui component :
- NativeWind v5 (sebagai utility class)
- gluestack-ui v5 (sebagai ui component)
- lucide-react-native (sebagai icon component)

# fitur yang akan di bangun :
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
Berikut adalah rekomendasi struktur direktori berbasis **Domain-Driven Design (DDD) concepts** yang disesuaikan untuk React Native / Expo Router, TanStack Query, Zustand, Zod, NativeWind v5, dan Gluestack UI v5:

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

