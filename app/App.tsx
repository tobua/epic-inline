import { SafeAreaView, Text, View } from 'react-native'
import 'epic-inline/register-react'
import { Type, configure } from 'epic-inline'

configure({ type: Type.Native })

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
