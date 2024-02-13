import * as React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  //   const runFirst = `
  //   setTimeout(function() {
  //       window.alert("Click me!");
  //       document.getElementById("rn-button").innerHTML =
  //       "<p class='font-p-M24 text-primary-900'>테스트 버튼</p>";

  //       document.getElementById("rn-button").addEventListener("click", function() {
  //         window.ReactNativeWebView.postMessage(JSON.stringify({message:'Hello!',token:'1q2w3e4r5t6y7u8i9o0p'}));
  //     });

  //     }, 1000);
  //   true; // note: this is required, or you'll sometimes get silent failures
  // `;

  return (
    <WebView
      source={{
        uri: 'https://growiary.com',
        // 'http://localhost:3000'
      }}
      // onMessage={event => {
      //   const data = event.nativeEvent.data;
      //   alert(JSON.parse(data).token);
      // }}
      // injectedJavaScript={runFirst}
    />
  );
}
