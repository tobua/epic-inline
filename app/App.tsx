import { SafeAreaView, Text, View } from 'react-native'
// NOTE support for React Native dropped.
import 'epic-inline/register-jsx'
import { configure, Type } from 'epic-inline'

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
