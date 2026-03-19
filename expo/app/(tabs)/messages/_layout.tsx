import { Stack } from "expo-router";
import React from "react";

import Colors from "@/constants/colors";

export default function MessagesLayout() {
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
          title: "Messages",
          headerTitleStyle: { fontWeight: "700" as const, fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="[chatId]"
        options={{
          headerTitleStyle: { fontWeight: "600" as const, fontSize: 16 },
        }}
      />
    </Stack>
  );
}
