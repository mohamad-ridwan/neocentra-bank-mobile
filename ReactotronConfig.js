import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "Neocentra Bank Mobile",
  host: "localhost", // WAJIB untuk Android + adb reverse
  port: 9090,
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

Reactotron.clear();
