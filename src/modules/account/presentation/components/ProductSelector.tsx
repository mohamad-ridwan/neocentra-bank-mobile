import React from "react";
import { View, Text, Pressable } from "react-native";
import { CheckCircle2, Shield, Crown, GraduationCap } from "lucide-react-native";
import { ProductType } from "../../domain/entities/account.entity";

interface ProductOption {
  type: ProductType;
  title: string;
  badge: string;
  description: string;
  perks: string[];
  icon: React.ElementType;
  accentColor: string;
}

const PRODUCTS: ProductOption[] = [
  {
    type: "REGULAR_SAVINGS",
    title: "Tabungan Reguler",
    badge: "POPULER",
    description: "Rekening serbaguna bebas biaya bulanan untuk transaksi sehari-hari.",
    perks: ["Gratis transfer BI-FAST", "Bunga hingga 4.5% p.a.", "Tanpa saldo minimum"],
    icon: Shield,
    accentColor: "#0066FF",
  },
  {
    type: "PRIORITY_SAVINGS",
    title: "Tabungan Prioritas",
    badge: "PREMIUM",
    description: "Layanan perbankan eksklusif dengan return bunga maksimal.",
    perks: ["Dedicated Relationship Manager", "Bunga hingga 6.0% p.a.", "Airport Lounge pass"],
    icon: Crown,
    accentColor: "#D97706",
  },
  {
    type: "STUDENT_SAVINGS",
    title: "Tabungan Pelajar / Muda",
    badge: "HEMAT",
    description: "Khusus generasi muda dan pelajar untuk mulai menabung cerdas.",
    perks: ["Cashback QRIS & e-Wallet", "Fitur auto-budgeting", "Bebas biaya admin"],
    icon: GraduationCap,
    accentColor: "#10B981",
  },
];

interface ProductSelectorProps {
  selectedType: ProductType;
  onSelect: (type: ProductType) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <View className="w-full space-y-3 mb-4">
      {PRODUCTS.map((prod) => {
        const isSelected = selectedType === prod.type;
        const IconComponent = prod.icon;

        return (
          <Pressable
            key={prod.type}
            onPress={() => onSelect(prod.type)}
            className={`p-4.5 rounded-2xl border-2 transition-all active:scale-[0.99] ${
              isSelected
                ? "bg-blue-50/60 dark:bg-blue-950/40 border-[#0066FF] shadow-md shadow-blue-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            }`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center space-x-2.5">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-2.5"
                  style={{ backgroundColor: `${prod.accentColor}15` }}
                >
                  <IconComponent size={20} color={prod.accentColor} />
                </View>
                <View>
                  <Text className="text-base font-bold text-slate-900 dark:text-white">
                    {prod.title}
                  </Text>
                  <Text className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    {prod.badge}
                  </Text>
                </View>
              </View>
              <View>
                {isSelected ? (
                  <CheckCircle2 size={22} color="#0066FF" />
                ) : (
                  <View className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                )}
              </View>
            </View>

            <Text className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 leading-4">
              {prod.description}
            </Text>

            <View className="flex-row flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {prod.perks.map((perk, i) => (
                <View
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                >
                  <Text className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                    • {perk}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
