import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Landmark, CheckCircle2, Copy } from "lucide-react-native";
import { Card, Badge } from "@/shared/components/ui";
import { formatCurrencyIDR } from "@/shared/utils/formatters";
import { BankAccount } from "../../domain/entities/account.entity";

interface AccountBalanceCardProps {
  account: BankAccount;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full bg-[#0A2540] dark:bg-neocentra-navy-dark border border-blue-900/50 dark:border-blue-800/40 p-6 rounded-3xl mb-6 shadow-xl">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Landmark size={18} color="#60A5FA" className="mr-2" />
          <Text className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Tabungan Utama Neocentra
          </Text>
        </View>
        <Badge
          label={account.status === "ACTIVE" ? "AKTIF" : account.status}
          variant={account.status === "ACTIVE" ? "success" : "warning"}
        />
      </View>

      <Text className="text-xs text-blue-200/80 mb-1">
        Total Saldo Efektif
      </Text>
      <Text className="text-3xl font-extrabold text-white mb-4">
        {formatCurrencyIDR(account.balance || 0)}
      </Text>

      <View className="flex-row items-center justify-between pt-3 border-t border-blue-900/60 dark:border-slate-800">
        <View>
          <Text className="text-[11px] text-blue-200/70">Nomor Rekening</Text>
          <Text className="text-sm font-mono font-bold text-white">
            {account.accountNumber}
          </Text>
        </View>
        <Pressable
          onPress={handleCopyAccount}
          className="flex-row items-center py-2 px-3 rounded-lg bg-white/10 active:bg-white/20"
        >
          {copied ? (
            <>
              <CheckCircle2 size={14} color="#34D399" className="mr-1.5" />
              <Text className="text-xs text-emerald-300 font-medium">Disalin</Text>
            </>
          ) : (
            <>
              <Copy size={14} color="#93C5FD" className="mr-1.5" />
              <Text className="text-xs text-blue-200 font-medium">Salin</Text>
            </>
          )}
        </Pressable>
      </View>
    </Card>
  );
};
