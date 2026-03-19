import { Stack } from "expo-router";
import React from "react";

import Colors from "@/constants/colors";

export default function FeedLayout() {
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
          title: "Pictura",
          headerTitleStyle: {
            fontWeight: "800" as const,
            fontSize: 24,
            fontFamily: undefined,
          },
        }}
      />
    </Stack>
  );
}
