import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import GalleryStackNavigator from "./GalleryStackNavigator";
import ImportAssetsStackNavigator from "./ImportAssetsStackNavigator";
import AuthStackNavigator from "./AuthStackNavigator";

export type RootStackParamList = {
  Gallery: undefined;
  ImportAssets: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = ({}) => {
  const isAuthenticated = true;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerLargeTitle: Platform.OS === "ios",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name={"Gallery"}
              options={{
                headerShown: false,
              }}
              component={GalleryStackNavigator}
            />
            <Stack.Screen
              name={"ImportAssets"}
              options={{ headerShown: false }}
              component={ImportAssetsStackNavigator}
            />
          </>
        ) : (
          <Stack.Screen
            options={{ headerShown: false }}
            name={"Auth"}
            component={AuthStackNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
