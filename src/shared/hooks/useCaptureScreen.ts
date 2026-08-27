import * as ScreenCapture from "expo-screen-capture";
import { useIsFocused } from "expo-router";
import { useEffect } from "react";

const useCaptureScreen = () => {
  const isFocused = useIsFocused();
  const screenCaptureKey = process.env.EXPO_PUBLIC_SCREEN_CAPTURE_KEY;

  useEffect(() => {
    if (isFocused) {
      ScreenCapture.preventScreenCaptureAsync(screenCaptureKey);
    } else {
      // Matikan proteksi saat pengguna meninggalkan halaman
      ScreenCapture.allowScreenCaptureAsync(screenCaptureKey);
    }

    return () => {
      ScreenCapture.allowScreenCaptureAsync(screenCaptureKey);
    };
  }, [isFocused]);
};

export default useCaptureScreen;
