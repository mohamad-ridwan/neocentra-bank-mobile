import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings, LogOut } from "lucide-react-native";
import { Button } from "@/shared/components/ui";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { useAccountsQuery } from "../../application/queries/useAccountsQuery";
import { useDashboardStore } from "../../application/store/useDashboardStore";
import { DashboardHeader } from "../components/DashboardHeader";
import { AccountBalanceCard } from "../components/AccountBalanceCard";
import { OpenAccountCard } from "../components/OpenAccountCard";
import { QuickActionsGrid } from "../components/QuickActionsGrid";
import { CustomerProfileCard } from "../components/CustomerProfileCard";

export const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { activeAccount } = useDashboardStore();

  // Query accounts from backend (encrypted payload)
  useAccountsQuery(user?.id);

  if (!user) return null;

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-neocentra-bg-dark"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
      >
        {/* Top Bar / Profile Header */}
        <DashboardHeader fullName={user.fullName} onLogout={logout} />

        {/* Dynamic Account Card: Balance Card if active account exists, else Open Account Card */}
        {activeAccount ? (
          <AccountBalanceCard account={activeAccount} />
        ) : (
          <OpenAccountCard />
        )}

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        {/* Account Profile Details */}
        <CustomerProfileCard
          nik={user.nik}
          email={user.email}
          phoneNumber={user.phoneNumber}
        />

        {/* Settings Shortcut Button */}
        <Button
          title="Buka Pengaturan & Tema"
          variant="secondary"
          size="md"
          onPress={() => router.push("/settings")}
          leftIcon={Settings}
          className="w-full mb-3"
        />

        {/* Logout Action */}
        <Button
          title="Keluar dari Aplikasi (Logout)"
          variant="outline"
          size="md"
          onPress={logout}
          leftIcon={LogOut}
          className="w-full border-rose-200 dark:border-rose-900/40"
          textClassName="text-rose-600 dark:text-rose-400"
        />
      </ScrollView>
    </SafeAreaView>
  );
};
