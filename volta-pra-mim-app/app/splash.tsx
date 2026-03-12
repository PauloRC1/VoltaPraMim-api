import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { api } from "@/services/api";
import { clearAuthData, getToken } from "@/services/auth.storage";

export default function Splash() {
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const loaderRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 500,
        delay: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const spinAnimation = Animated.loop(
      Animated.timing(loaderRotate, {
        toValue: 1,
        duration: 950,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    spinAnimation.start();

    async function bootstrapSession() {
      const minimumSplashTime = new Promise((resolve) =>
        setTimeout(resolve, 1800),
      );

      let nextRoute = "/login";

      try {
        const token = await getToken();

        if (token) {
          await api.get("/auth/me");
          nextRoute = "/home";
        }
      } catch {
        await clearAuthData();
      }

      await minimumSplashTime;

      if (isMounted) {
        router.replace(nextRoute);
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
      spinAnimation.stop();
      loaderRotate.stopAnimation();
    };
  }, [contentOpacity, footerOpacity, loaderRotate, logoScale]);

  const loaderSpin = loaderRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>VoltaPraMim</Text>
        <Text style={styles.subtitle}>Sistema de Achados e Perdidos</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
        <Animated.View
          style={[styles.loader, { transform: [{ rotate: loaderSpin }] }]}
        >
          <View style={styles.loaderCut} />
        </Animated.View>
        <Text style={styles.version}>v1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F56B0",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 22,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -124,
  },
  logo: {
    width: 620,
    height: 620,
    marginBottom: -126,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#F2F6FF",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  loader: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderCut: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2F56B0",
    right: -1,
    top: 1,
  },
  version: {
    color: "#DCE6FF",
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
