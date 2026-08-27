import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "Neocentra Bank Mobile",
  host: "192.168.1.7", // IP address Mac karena device connect via Wi-Fi
  port: 9090,
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

Reactotron.clear();
