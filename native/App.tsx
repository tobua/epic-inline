// This file will be copied over to the demo app when running create-native-app.js.
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import 'epic-inline/register-react'
import { configure, Type } from 'epic-inline'

configure({ type: Type.native })

export default () => (
  <SafeAreaView>
    <View className="items mv-large">
      <Text className="fontSize-large">epic-inline</Text>
    </View>
    <View className="m-small radius p-medium backgroundColor-blue">
      <Text className="bold color-white">React Native</Text>
    </View>
  </SafeAreaView>
)

declare module 'react-native' {
  export interface ViewProps {
    className?: string
  }
  export interface TextProps {
    className?: string
  }
}
