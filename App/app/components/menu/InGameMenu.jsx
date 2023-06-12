import { View, Text } from 'react-native'
import React from 'react'
import AppText from '../tools/AppText'

const InGameMenu = () => {
    const data = {
            "points": [
                {
                    "x": 0,
                    "y": 0,
                    "questionNumber": 0,
                    "completed": false
                }
            ],
            "completedQuestions": 0,
            "totalQuestions": 1
    }
  return (
    <View>
      <AppText>InGameMenu</AppText>
    </View>
  )
}

export default InGameMenu