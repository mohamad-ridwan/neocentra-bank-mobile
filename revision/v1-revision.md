implementasikan revisi / refactor code pembuatan, dan penggunaan ui component agar konsisten secara pembuatannya di shared folder "neocentra-bank-mobile/src/shared" dengan menggunakan gluestack-ui v4

anda bisa melihat arsitektur pada aplikasi neocentra-bank-mobile di "neocentra-bank-mobile/architectures/v1-architecture.md", supaya tidak perlu analisis ulang aplikasi secara keseluruhan.

perubahan components/ui pada shared folder :
rubah pembuatan manual component dengan nativewind, ganti dengan menggunakan gluestack-ui v4 di semua component di dalam "neocentra-bank-mobile/src/shared/components/ui", diantaranya : Badge.tsx, Button.tsx, Card.tsx, Input.tsx, Toast.tsx, Typography.tsx

contoh penggunaan ui component dari gluestack-ui v4 :
- anda bisa melihat di dokumentasi resmi gluestack-ui v4 "https://v4.gluestack.io/ui/docs/components/input" untuk membuatnya.
- direkomendasikan menggunakan manual untuk menambahkan component daripada menggunakan CLI "npx gluestack-ui add component-name", karena alasan untuk konsistensi struktur folder dan penggunaan code.
- gunakan custom theme yang konsisten di setiap component/ui yang dibuat, gunakan theme dari customisasi warna yang sudah ditentukan di "neocentra-bank-mobile/src/shared/styles/global.css".

membuat custom theme dengan nativewind v4 :
- buatkan custom theme dengan nama yang tepat dari warna yang digunakan saat ini di aplikasi, dan simpan di dalam "neocentra-bank-mobile/src/shared/styles/global.css".

setelah component ui di revisi / refactor, pastikan konsumsi component ui tidak ada kesalahan sintaks, dan props yang digunakan. component yang menggunakan shared component/ui :
- neocentra-bank-mobile/src/app/index.tsx
- neocentra-bank-mobile/src/app/settings.tsx
- neocentra-bank-mobile/src/modules/auth/presentation/components/AuthHeader.tsx
- neocentra-bank-mobile/src/modules/auth/presentation/components/LoginForm.tsx
- neocentra-bank-mobile/src/modules/auth/presentation/components/RegisterForm.tsx
- neocentra-bank-mobile/src/modules/auth/presentation/screens/LoginScreen.tsx
- neocentra-bank-mobile/src/modules/auth/presentation/screens/RegisterScreen.tsx
