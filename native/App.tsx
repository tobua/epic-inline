// This file will be copied over to the demo app when running create-native-app.js.
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { ei, configure, Type } from 'epic-inline'

configure({ type: Type.native })

export default () => (
  <SafeAreaView>
    <View style={ei('items mv-large')}>
      <Text style={ei('fontSize-large')}>epic-inline</Text>
    </View>
    <View style={ei('m-small radius p-medium backgroundColor-blue')}>
      <Text style={ei('bold color-white')}>React Native</Text>
    </View>
  </SafeAreaView>
)
