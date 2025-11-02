import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../components/componentes/Logo";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();

  // Criar animações para bolhas
  const bubbles = Array.from({ length: 8 }).map(() => ({
    translateY: useRef(new Animated.Value(Math.random() * height)).current,
    translateX: Math.random() * width,
    size: 20 + Math.random() * 30,
    duration: 4000 + Math.random() * 4000,
  }));

  useEffect(() => {
    bubbles.forEach((bubble) => {
      const animate = () => {
        bubble.translateY.setValue(height + bubble.size);
        Animated.timing(bubble.translateY, {
          toValue: -bubble.size,
          duration: bubble.duration,
          useNativeDriver: true,
        }).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Bolhas animadas */}
        {bubbles.map((bubble, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bubble,
              {
                width: bubble.size,
                height: bubble.size,
                left: bubble.translateX,
                transform: [{ translateY: bubble.translateY }],
              },
            ]}
          />
        ))}

        <Logo />
        <Text style={styles.title}>Lavandaria Brilho</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(registo)/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#007AFF",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(0, 122, 255, 0.2)",
    borderRadius: 50,
  },
});