import React from "react";
import { View } from "react-native";

interface PinIndicatorProps {
  length?: number;
  valueLength: number;
  hasError?: boolean;
}

export const PinIndicator: React.FC<PinIndicatorProps> = ({
  length = 6,
  valueLength,
  hasError = false,
}) => {
  const dots = Array.from({ length });

  return (
    <View className="flex-row justify-center items-center space-x-4 my-6">
      {dots.map((_, index) => {
        const isFilled = index < valueLength;

        let dotStyle = "w-4 h-4 rounded-full border-2 mx-2 ";

        if (hasError) {
          dotStyle += isFilled
            ? "bg-rose-500 border-rose-500"
            : "border-rose-400/50 bg-rose-500/10";
        } else if (isFilled) {
          dotStyle += "bg-[#0066FF] border-[#0066FF] scale-110 shadow-md shadow-blue-500/50";
        } else {
          dotStyle += "border-slate-300 dark:border-slate-700 bg-transparent";
        }

        return <View key={`dot-${index}`} className={dotStyle} />;
      })}
    </View>
  );
};
