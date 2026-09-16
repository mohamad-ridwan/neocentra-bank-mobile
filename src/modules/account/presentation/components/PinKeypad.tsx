import React from "react";
import { View, Text, Pressable } from "react-native";
import { Delete } from "lucide-react-native";

interface PinKeypadProps {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  disabled?: boolean;
}

export const PinKeypad: React.FC<PinKeypadProps> = ({
  onDigitPress,
  onDeletePress,
  disabled = false,
}) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "DEL"],
  ];

  return (
    <View className="w-full max-w-[320px] self-center my-4">
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row justify-between mb-4">
          {row.map((key, colIndex) => {
            if (key === "") {
              return <View key={`empty-${colIndex}`} className="w-20 h-20" />;
            }

            if (key === "DEL") {
              return (
                <Pressable
                  key="key-del"
                  onPress={onDeletePress}
                  disabled={disabled}
                  className="w-20 h-20 rounded-full items-center justify-center active:bg-slate-200 dark:active:bg-slate-800"
                >
                  <Delete size={26} color="#94A3B8" />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={`key-${key}`}
                onPress={() => onDigitPress(key)}
                disabled={disabled}
                className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 items-center justify-center active:bg-blue-600 dark:active:bg-blue-600 shadow-sm"
              >
                {({ pressed }) => (
                  <Text
                    className={`text-2xl font-bold ${
                      pressed
                        ? "text-white"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {key}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
