import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Text } from 'linked-data-browser';

type QueryTextEditorProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

type QueryTextOutputProps = {
  value: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function getPlaceholderColor(color: string): string {
  return color.startsWith('hsl(')
    ? color.replace(')', ' / 0.6)')
    : color;
}

export function QueryTextEditor({
  style,
  multiline = true,
  numberOfLines = 4,
  placeholderTextColor,
  ...props
}: QueryTextEditorProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.surface,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
          color: colors.text,
        },
        props.editable === false && styles.surfaceDisabled,
        style,
      ]}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColor={placeholderTextColor ?? getPlaceholderColor(colors.text)}
      {...props}
    />
  );
}

export function QueryTextOutput({
  value,
  style,
  textStyle,
}: QueryTextOutputProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[
        styles.surface,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        style,
      ]}
      contentContainerStyle={styles.outputContent}
      nestedScrollEnabled
    >
      <Text
        selectable
        style={[styles.outputText, textStyle] as any}
      >
        {value}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  surfaceDisabled: {
    opacity: 0.85,
  },
  outputContent: {
    flexGrow: 1,
  },
  outputText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
