import { useEffect, useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

const fallbackImage = require("../assets/images/mochila.png");

type ItemImageProps = {
  imageUrl?: string | null;
  style: StyleProp<ImageStyle>;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
};

export function ItemImage({
  imageUrl,
  style,
  resizeMode = "cover",
}: ItemImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  return (
    <Image
      source={!imageUrl || hasError ? fallbackImage : { uri: imageUrl }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setHasError(true)}
    />
  );
}
