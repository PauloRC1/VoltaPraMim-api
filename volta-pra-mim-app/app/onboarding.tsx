import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: number;
  imageStyle?: ImageStyle;
  textBlockStyle?: {
    marginTop?: number;
  };
};

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Perdeu ou encontrou algo?",
    description:
      "Publique itens encontrados e ajude colegas a recuperarem seus pertences dentro da universidade.",
    image: require("../assets/images/OnboardingScreen1.png"),
    imageStyle: { width: "118%", height: 430 },
    textBlockStyle: { marginTop: -30 },
  },
  {
    id: "2",
    title: "Encontre itens rapidamente",
    description:
      "Pesquise entre itens encontrados na universidade e veja se alguém encontrou o que você perdeu.",
    image: require("../assets/images/OnboardingScreen2.png"),
    imageStyle: { width: "112%", height: 408 },
    textBlockStyle: { marginTop: -20 },
  },
  {
    id: "3",
    title: "Conecte-se e recupere seus itens",
    description:
      "Entre em contato com quem encontrou o item e combine a devolução de forma rápida e segura.",
    image: require("../assets/images/OnboardingScreen3.png"),
    imageStyle: { width: "114%", height: 420 },
    textBlockStyle: { marginTop: -18 },
  },
];

export default function OnboardingScreen() {
  const listRef = useRef<FlatList<(typeof onboardingData)[number]>>(null);
  const hintOpacity = useRef(new Animated.Value(0.4)).current;
  const hintTranslate = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex !== onboardingData.length - 1) {
      hintOpacity.stopAnimation();
      hintTranslate.stopAnimation();
      hintOpacity.setValue(0.4);
      hintTranslate.setValue(0);
      return;
    }

    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(hintOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(hintOpacity, {
            toValue: 0.45,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(hintTranslate, {
            toValue: -4,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(hintTranslate, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
      hintOpacity.stopAnimation();
      hintTranslate.stopAnimation();
    };
  }, [currentIndex, hintOpacity, hintTranslate]);

  function handleEnterApp() {
    router.replace("/login");
  }

  function handleBack() {
    if (currentIndex === 0) {
      return;
    }

    listRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
  }

  function handleMomentumScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(nextIndex);
  }

  function renderItem({
    item,
    index,
  }: {
    item: (typeof onboardingData)[number];
    index: number;
  }) {
    return (
      <Pressable
        style={[styles.slide, { width }]}
        onPress={() => {
          if (index === onboardingData.length - 1) {
            handleEnterApp();
          }
        }}
      >
        <View style={styles.imageFrame}>
          <Image
            source={item.image}
            style={[styles.image, item.imageStyle]}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.textBlock, item.textBlockStyle]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={12}
        >
          {currentIndex > 0 ? (
            <Ionicons name="chevron-back" size={22} color="#F9D12B" />
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </Pressable>

        <Pressable onPress={handleEnterApp} hitSlop={12}>
          <Text style={styles.skip}>Pular</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.dotsContainer}>
        {onboardingData.map((item, index) => (
          <View
            key={item.id}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.finishArea}>
        {currentIndex === onboardingData.length - 1 ? (
          <Animated.View
            style={{
              opacity: hintOpacity,
              transform: [{ translateY: hintTranslate }],
            }}
          >
            <Pressable
              style={styles.finishHint}
              onPress={handleEnterApp}
              hitSlop={12}
            >
              <Text style={styles.finishHintText}>Toque para entrar</Text>
              <Ionicons name="hand-left-outline" size={17} color="#F9D12B" />
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3F5CB8",
    paddingTop: 54,
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backPlaceholder: {
    width: 22,
    height: 22,
  },
  skip: {
    color: "#FFC107",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 2,
    paddingBottom: 2,
  },
  imageFrame: {
    height: 420,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    alignSelf: "center",
    marginBottom: 2,
  },
  textBlock: {
    paddingHorizontal: 18,
    paddingTop: 0,
    marginTop: -8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 34,
    marginBottom: 12,
  },
  description: {
    color: "#F2F5FF",
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 330,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: -2,
    marginBottom: 2,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  activeDot: {
    backgroundColor: "#FFC107",
  },
  finishArea: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  finishHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(249,209,43,0.22)",
    borderWidth: 1,
    borderColor: "rgba(249,209,43,0.26)",
  },
  finishHintText: {
    color: "#F9D12B",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
