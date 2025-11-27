import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const webmap = require('../../assets/html/map.html');

export default function MapScreen() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.container}>
      {isWeb ? (
        <iframe
          src={webmap as unknown as string}
          style={{ flex: 1, border: 0, width: '100%', height: '100%' }}
        />
      ) : (
        <WebView style={styles.webview} source={webmap} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
