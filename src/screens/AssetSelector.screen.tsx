import { StyleSheet, View, Alert } from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { MediaType } from "expo-media-library";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  AssetSelectorScreenNavigationProps,
  AssetSelectorScreenRouteProps,
} from "../navigation/types";
import { importMediaFileIntoAlbum } from "../util/MediaHelper";
import * as MediaLibrary from "expo-media-library";

interface AssetSelectorProps {}

const AssetSelectorScreen: React.FC<AssetSelectorProps> = ({}) => {
  const navigation = useNavigation<AssetSelectorScreenNavigationProps>();
  const route = useRoute<AssetSelectorScreenRouteProps>();

  const goBack = () => {
    // navigation.canGoBack()
    // ? navigation.goBack()
    // : navigation.navigate("AlbumDetail", {
    //     albumName: route.params.albumName,
    //   // assetsHaveBeenImported: true,
    //   });
    navigation.navigate("AlbumDetail", {
      albumName: route.params.albumName,
      assetsHaveBeenImported: true,
    });
  };

  const importMedia = async (data: any) => {
    for (const asset of data) {
      await importMediaFileIntoAlbum(asset.localUri, route.params.albumName);
    }

    const assetIds = data.map((asset: any) => asset.id);

    Alert.alert(
      "Duplikate löschen?",
      "Wenn sie die importierten Dateien aus ihrer Galerie löschen wollen, drücken sie im nächsten Schritt auf 'Löschen'",
      [
        {
          text: "Weiter",
          onPress: async () => await MediaLibrary.deleteAssetsAsync(assetIds),
        },
        {
          text: "Nein",
          style: "cancel",
        },
      ]
    );

    goBack();
  };

  const widgetSettings = useMemo(
    () => ({
      getImageMetaData: true,
      initialLoad: 100,
      assetsType: [MediaType.photo, MediaType.video],
      minSelection: 1,
      maxSelection: 20,
      portraitCols: 3,
      landscapeCols: 3,
    }),
    []
  );

  const widgetErrors = useMemo(
    () => ({
      errorTextColor: "red",
      errorMessages: {
        hasErrorWithPermissions: "Permission denied",
        hasErrorWithLoading: "Error loading assets",
        hasErrorWithResizing: "Error resizing image",
        hasNoAssets: "No assets found",
      },
    }),
    []
  );

  const widgetStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: "black",
      spinnerColor: "white",
      widgetWidth: 99,
      screenStyle: {
        borderRadius: 5,
        overflow: "hidden",
      },
      widgetStyle: {
        margin: 10,
      },
      videoIcon: {
        Component: Ionicons,
        iconName: "ios-videocam",
        color: "white",
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: "ios-checkmark-circle-outline",
        color: "white",
        bg: "rgba(0,0,0,0.5)",
        size: 26,
      },
    }),
    []
  );

  const widgetNavigator = useMemo(
    () => ({
      Texts: {
        finish: "Bestätigen",
        back: "Zurück",
        selected: "ausgewählt",
      },
      midTextColor: "white",
      minSelection: 1,
      buttonTextStyle: { color: "#2997ff", fontSize: 16 },
      buttonStyle: {
        backgroundColor: "black",
        borderRadius: 5,
      },
      onBack: goBack,
      onSuccess: (data: any) => importMedia(data),
    }),
    []
  );
  return (
    <View style={styles.root}>
      <AssetsSelector
        Settings={widgetSettings}
        Errors={widgetErrors}
        // @ts-ignore
        Styles={widgetStyles}
        Navigator={widgetNavigator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default AssetSelectorScreen;
