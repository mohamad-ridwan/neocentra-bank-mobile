neocentra-bank-mobile/
├── src/
│   ├── app/                                 # Presentation Layer: Expo Router
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx                  # Auth group layout (Stack navigation)
│   │   │   ├── login.tsx                    # Route: /login
│   │   │   └── register.tsx                 # Route: /register
│   │   ├── _layout.tsx                      # Root layout (Providers: QueryClient, Gluestack/Theme)
│   │   └── index.tsx                        # Entry / Auth redirect / Landing
│   │
│   ├── modules/                             # DDD Bounded Contexts
│   │   └── auth/                            # Auth Module
│   │       ├── domain/                      # Enterprise / Pure Business Rules
│   │       │   ├── entities/
│   │       │   │   └── user.entity.ts       # User model, AuthSession, AuthStatus
│   │       │   └── schemas/
│   │       │       ├── login.schema.ts      # Zod validation for Login
│   │       │       └── register.schema.ts   # Zod validation for NIK (16-digit), Email, Phone, Passwords
│   │       │
│   │       ├── application/                 # Application Logic & State
│   │       │   ├── store/
│   │       │   │   └── useAuthStore.ts      # Zustand global auth state
│   │       │   └── queries/
│   │       │       ├── useLoginMutation.ts  # TanStack Query login mutation
│   │       │       └── useRegisterMutation.ts # TanStack Query register mutation
│   │       │
│   │       ├── infrastructure/              # External APIs & Mappers
│   │       │   ├── api/
│   │       │   │   └── auth.api.ts          # Axios / Fetch auth caller with idempotency support
│   │       │   └── mappers/
│   │       │       └── user.mapper.ts       # DTO to Domain Entity Mapper
│   │       │
│   │       └── presentation/                # Domain UI Components & Screens
│   │           ├── components/
│   │           │   ├── LoginForm.tsx        # Login Form UI with reactive validation
│   │           │   ├── RegisterForm.tsx     # Register Form UI with multi-field checks & strength bar
│   │           │   └── AuthHeader.tsx       # Neocentra branding, logo, and title banner
│   │           └── screens/
│   │               ├── LoginScreen.tsx      # Login Container View
│   │               └── RegisterScreen.tsx   # Register Container View
│   │
│   └── shared/                              # Shared Kernel
│       ├── components/
│       │   └── ui/                          # Gluestack UI + NativeWind Styled Components
│       │       ├── Button.tsx               # Primary, Outline, Ghost, Loading button
│       │       ├── Input.tsx                # Text input with icon slots & error states
│       │       ├── Card.tsx                 # Neocentra premium glass/slate card
│       │       ├── Typography.tsx           # Text, Heading, Subheading, Label, Caption
│       │       ├── Badge.tsx                # Status badge component
│       │       ├── Toast.tsx                # Feedback alert / notification
│       │       └── GluestackProvider.tsx    # Theme and context wrapper
│       ├── hooks/
│       │   ├── useColorScheme.ts            # Dark/Light mode hook
│       │   └── useDebounce.ts               # Input debounce hook
│       ├── infrastructure/
│       │   └── http-client.ts               # Configured Axios instance with interceptors
│       ├── styles/
│       │   └── global.css                   # Tailwind base/components/utilities & bank theme
│       └── utils/
│           ├── idempotency.ts               # UUID v4 idempotency key generator
│           └── formatters.ts                # NIK, phone number & currency formatters
