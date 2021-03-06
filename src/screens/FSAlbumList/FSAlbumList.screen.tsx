import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { initMediaRoot } from "../../util/MediaHelper";
import AlbumPreview from "./components/AlbumPreview";
import CreateAlbumDialog from "./components/CreateAlbumDialog";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FSAlbumListScreenNavigationProps } from "../../navigation/types";
import { useAlbumContext } from "../../context/AlbumContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Haptics from "expo-haptics";
import * as FS from "expo-file-system";

const FSAlbumListScreen: React.FC = ({}) => {
  const navigation = useNavigation<FSAlbumListScreenNavigationProps>();

  const { showActionSheetWithOptions } = useActionSheet();

  const [showDialog, setShowDialog] = useState(false);

  const albumContext = useAlbumContext();
  if (!albumContext) throw new Error("MetaAlbumContext not found");

  useEffect(() => {
    // init directory structure
    initMediaRoot();
  }, []);

  const openAlbumActionSheet = (albumName: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const options = [
      `Album "${albumName}" umbenennen`,
      `Album "${albumName}" löschen`,
      "Abbrechen",
    ];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          Alert.prompt(
            `Album "${albumName}" umbenennen`,
            "",
            (newAlbumName) => {
              if (newAlbumName) {
                console.log("newAlbumName", newAlbumName);
                albumContext.editAlbumName(albumName, newAlbumName);
              }
            }
          );
        }
        if (buttonIndex === 1) {
          Alert.alert(
            "Album löschen",
            `Möchtest du das Album "${albumName}" wirklich löschen?`,
            [
              {
                text: "Abbrechen",
                style: "cancel",
              },
              {
                text: "Löschen",
                onPress: () => albumContext.deleteAlbum(albumName),
              },
            ]
          );
        }
      }
    );
  };

  const createAlbum = async (name: string) => {
    const successful = await albumContext.addAlbum(name);

    if (!successful)
      Alert.alert("Fehler", "Ein Album mit dem Namen existiert bereits.");
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={albumContext.metaAlbums}
        renderItem={({ item }) => (
          <AlbumPreview
            onLongPress={() => openAlbumActionSheet(item.name)}
            key={item.name}
            albumName={item.name}
          />
        )}
        numColumns={2}
        style={{ marginLeft: -2, marginRight: -2 }}
      />

      <CreateAlbumDialog
        visible={showDialog}
        createAlbum={createAlbum}
        onCancel={() => setShowDialog(false)}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            // Platform.OS === "ios" ?
            Alert.prompt("Neues Album erstellen", "", createAlbum);
            // : setShowDialog((v) => !v);
          }}
        >
          <Text style={{ color: "white", marginRight: 10, fontSize: 15 }}>
            Album erstellen
          </Text>
          <AntDesign name="addfolder" size={28} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "black",
    flex: 1,
  },
  footer: {
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    paddingVertical: 10,
  },
});

export default FSAlbumListScreen;
