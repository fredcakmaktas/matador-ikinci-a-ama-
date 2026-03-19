import { Stack } from "expo-router";
import React from "react";

import Colors from "@/constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerShadowVisible: false,
        headerTintColor: Colors.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
        }}
      />
    </Stack>
  );
}
