import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
} from 'linked-data-browser';

export function NemalineView() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="h1" style={styles.title}>
          Not supported on mobile
        </Text>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
  },
  tableWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    backgroundColor: 'hsl(var(--card))',
    alignSelf: 'flex-start',
  },
  table: {
    width: '100%',
    flex: 0,
    flexGrow: 0,
  },
  tableHeader: {
    backgroundColor: 'hsl(var(--muted))',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  headerRow: {
    borderBottomWidth: 0,
  },
  tableHead: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  tableBody: {
    borderBottomWidth: 0,
    flex: 0,
    flexGrow: 0,
  },
  headerLabel: {
    fontWeight: '600',
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  bodyRowStriped: {
    backgroundColor: 'hsl(var(--muted) / 0.35)',
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cellText: {
    fontSize: 13,
  },
  badge: {
    alignSelf: 'center',
  },
  nestedRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
    backgroundColor: 'hsl(var(--muted) / 0.25)',
  },
  nestedCell: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 28,
  },
  nestedWrapper: {
    marginTop: 2,
  },
  nestedTitle: {
    marginBottom: 8,
  },
  nestedTable: {
    width: '100%',
    maxWidth: 420,
  },
  nestedTableHeader: {
    backgroundColor: 'hsl(var(--muted))',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  nestedTableHead: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  nestedBodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(var(--border))',
  },
  nestedTableCell: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
