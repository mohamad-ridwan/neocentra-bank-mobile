import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Check, ShieldCheck, Lock } from "lucide-react-native";
import { Button, Input } from "@/shared/components/ui";
import { useOpenAccountStore } from "../../application/store/useOpenAccountStore";
import { useOpenAccountMutation } from "../../application/queries/useOpenAccountMutation";
import { ProductSelector } from "../components/ProductSelector";
import { PinIndicator } from "../components/PinIndicator";
import { PinKeypad } from "../components/PinKeypad";
import { isPINStrong } from "../../domain/schemas/open-account.schema";

export const OpenAccountWizardScreen: React.FC = () => {
  const router = useRouter();
  const {
    currentStep,
    productType,
    occupation,
    monthlyIncome,
    sourceOfFunds,
    agreedToTerms,
    pin,
    confirmPin,
    errorMessage,
    setCurrentStep,
    setProductType,
    setEmploymentData,
    setAgreedToTerms,
    appendPinDigit,
    deletePinDigit,
    appendConfirmPinDigit,
    deleteConfirmPinDigit,
    clearPins,
    setErrorMessage,
    resetWizard,
  } = useOpenAccountStore();

  const openAccountMutation = useOpenAccountMutation();

  // Reset wizard saat unmount jika perlu
  useEffect(() => {
    return () => {
      // Keep state if needed, or reset
    };
  }, []);

  // Handlers for Step 2: Setup PIN
  useEffect(() => {
    if (currentStep === 2 && pin.length === 6) {
      const validation = isPINStrong(pin);
      if (!validation.valid) {
        setErrorMessage(validation.message || "PIN terlalu mudah ditebak.");
        return;
      }
      // Pindah ke step 3 (konfirmasi)
      setCurrentStep(3);
    }
  }, [pin, currentStep]);

  // Handlers for Step 3: Confirm PIN & Submit
  useEffect(() => {
    if (currentStep === 3 && confirmPin.length === 6) {
      if (confirmPin !== pin) {
        setErrorMessage("Konfirmasi PIN tidak cocok dengan PIN pertama.");
        setTimeout(() => {
          clearPins();
          setCurrentStep(2);
        }, 1500);
        return;
      }

      // Submit pembukaan rekening
      handleSubmit();
    }
  }, [confirmPin, currentStep]);

  const handleNextToPin = () => {
    if (!occupation.trim()) {
      setErrorMessage("Pekerjaan wajib diisi.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage("Anda harus menyetujui Syarat & Ketentuan Perbankan.");
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    openAccountMutation.mutate(
      {
        productType,
        branchCode: "001",
        pin,
        employmentData: {
          occupation,
          monthlyIncome,
          sourceOfFunds,
        },
      },
      {
        onSuccess: (data) => {
          router.replace("/account/open-account-success");
        },
        onError: (err: any) => {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Gagal membuka rekening. Silakan coba lagi.";
          setErrorMessage(msg);
          Alert.alert("Gagal Membuka Rekening", msg);
          clearPins();
          setCurrentStep(2);
        },
      }
    );
  };

  const handleBack = () => {
    if (currentStep === 3) {
      clearPins();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      clearPins();
      setCurrentStep(1);
    } else {
      resetWizard();
      router.back();
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-neocentra-bg-dark"
      edges={["top", "left", "right"]}
    >
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-200/80 dark:border-slate-800">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center active:opacity-75"
        >
          <ArrowLeft size={20} color="#0066FF" />
        </Pressable>
        <Text className="text-base font-bold text-slate-900 dark:text-white">
          Buka Rekening Tabungan
        </Text>
        <View className="w-10" />
      </View>

      {/* Step Progress Bar */}
      <View className="flex-row px-5 py-3 space-x-2">
        <View
          className={`flex-1 h-1.5 rounded-full ${
            currentStep >= 1 ? "bg-[#0066FF]" : "bg-slate-200 dark:bg-slate-800"
          }`}
        />
        <View
          className={`flex-1 h-1.5 rounded-full ${
            currentStep >= 2 ? "bg-[#0066FF]" : "bg-slate-200 dark:bg-slate-800"
          }`}
        />
        <View
          className={`flex-1 h-1.5 rounded-full ${
            currentStep >= 3 ? "bg-[#0066FF]" : "bg-slate-200 dark:bg-slate-800"
          }`}
        />
      </View>

      {/* Step 1: Product Selection & Supplementary Form */}
      {currentStep === 1 && (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white mt-3 mb-1">
            Pilih Jenis Tabungan
          </Text>
          <Text className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Pilih produk tabungan yang paling sesuai dengan kebutuhan finansial Anda.
          </Text>

          {/* Product Cards */}
          <ProductSelector
            selectedType={productType}
            onSelect={(type) => setProductType(type)}
          />

          {/* Supplementary KYC Fields */}
          <Text className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-3">
            Data Suplemen Nasabah
          </Text>

          <Input
            label="Pekerjaan Saat Ini"
            value={occupation}
            onChangeText={(val) =>
              setEmploymentData({ occupation: val, monthlyIncome, sourceOfFunds })
            }
            placeholder="Contoh: Karyawan Swasta, Wiraswasta"
            className="mb-3"
          />

          <Input
            label="Rentang Penghasilan Bulanan"
            value={monthlyIncome}
            onChangeText={(val) =>
              setEmploymentData({ occupation, monthlyIncome: val, sourceOfFunds })
            }
            placeholder="Contoh: Rp 10.000.000 - Rp 20.000.000"
            className="mb-3"
          />

          <Input
            label="Sumber Dana Utama"
            value={sourceOfFunds}
            onChangeText={(val) =>
              setEmploymentData({ occupation, monthlyIncome, sourceOfFunds: val })
            }
            placeholder="Contoh: Gaji, Hasil Usaha, Tabungan"
            className="mb-4"
          />

          {/* Terms & Agreement */}
          <Pressable
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="flex-row items-start p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 active:opacity-80"
          >
            <View
              className={`w-5 h-5 rounded-md border mr-3 items-center justify-center mt-0.5 ${
                agreedToTerms
                  ? "bg-[#0066FF] border-[#0066FF]"
                  : "border-slate-400 bg-transparent"
              }`}
            >
              {agreedToTerms && <Check size={14} color="#FFF" />}
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-700 dark:text-slate-300 leading-5">
                Saya menyatakan data yang diberikan adalah benar dan menyetujui{" "}
                <Text className="text-blue-600 font-bold">
                  Syarat & Ketentuan Pembukaan Rekening
                </Text>{" "}
                Neocentra Bank serta kepatuhan regulasi LPS & OJK.
              </Text>
            </View>
          </Pressable>

          {errorMessage && (
            <Text className="text-xs text-rose-500 font-semibold mb-4 text-center">
              {errorMessage}
            </Text>
          )}

          <Button
            title="Lanjutkan Buat PIN Transaksi"
            variant="primary"
            size="lg"
            onPress={handleNextToPin}
            className="w-full bg-[#0066FF]"
          />
        </ScrollView>
      )}

      {/* Step 2: Set 6-Digit PIN */}
      {currentStep === 2 && (
        <View className="flex-1 px-5 justify-between pb-8">
          <View className="items-center mt-6">
            <View className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 items-center justify-center mb-3">
              <Lock size={28} color="#0066FF" />
            </View>
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 text-center">
              Buat PIN Transaksi
            </Text>
            <Text className="text-xs text-slate-500 text-center max-w-[280px]">
              Buat 6 digit PIN untuk mengamankan seluruh transaksi finansial (Transfer, QRIS, Top Up) Anda.
            </Text>

            <PinIndicator
              valueLength={pin.length}
              hasError={Boolean(errorMessage)}
            />

            {errorMessage ? (
              <Text className="text-xs text-rose-500 font-semibold text-center px-4">
                {errorMessage}
              </Text>
            ) : (
              <Text className="text-[11px] text-slate-400 text-center">
                Hindari angka kembar (111111) atau berurutan (123456)
              </Text>
            )}
          </View>

          <PinKeypad
            onDigitPress={appendPinDigit}
            onDeletePress={deletePinDigit}
          />
        </View>
      )}

      {/* Step 3: Confirm 6-Digit PIN */}
      {currentStep === 3 && (
        <View className="flex-1 px-5 justify-between pb-8">
          <View className="items-center mt-6">
            <View className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 items-center justify-center mb-3">
              <ShieldCheck size={28} color="#10B981" />
            </View>
            <Text className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 text-center">
              Konfirmasi PIN Transaksi
            </Text>
            <Text className="text-xs text-slate-500 text-center max-w-[280px]">
              Masukkan kembali 6 digit PIN yang sama untuk memastikan tidak ada kesalahan input.
            </Text>

            <PinIndicator
              valueLength={confirmPin.length}
              hasError={Boolean(errorMessage)}
            />

            {openAccountMutation.isPending ? (
              <View className="flex-row items-center space-x-2 my-2">
                <ActivityIndicator size="small" color="#0066FF" />
                <Text className="text-xs text-blue-600 font-medium ml-2">
                  Memproses pembukaan rekening & enkripsi...
                </Text>
              </View>
            ) : errorMessage ? (
              <Text className="text-xs text-rose-500 font-semibold text-center px-4">
                {errorMessage}
              </Text>
            ) : (
              <Text className="text-[11px] text-slate-400 text-center">
                PIN akan dienkripsi dengan standar perbankan PCI-DSS
              </Text>
            )}
          </View>

          <PinKeypad
            onDigitPress={appendConfirmPinDigit}
            onDeletePress={deleteConfirmPinDigit}
            disabled={openAccountMutation.isPending}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
