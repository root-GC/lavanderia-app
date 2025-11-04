import React from 'react';
import { TextInput, View, Text } from 'react-native';

import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5
        }}
        {...props}
      />
    </View>
  );
}