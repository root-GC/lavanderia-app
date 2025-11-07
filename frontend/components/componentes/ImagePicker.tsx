import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
}

export default function ImagePickerComponent({ imageUri, setImageUri }: Props) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "É necessário permitir acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  return (
    <View style={{ marginVertical: 10, alignItems: "center" }}>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 150, height: 150, borderRadius: 12 }} />}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 10, padding: 10, backgroundColor: "#007AFF", borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>📸 Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickFromGallery} style={{ padding: 10, backgroundColor: "#34C759", borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>🖼️ Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}