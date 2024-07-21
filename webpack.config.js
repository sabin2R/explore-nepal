const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': 'react-native-web',
    'react-native-maps$': 'react-native-web-maps',
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native/Libraries/Components/UnimplementedViews/UnimplementedView': 'react-native-web/dist/exports/UnimplementedView',
    'react-native/Libraries/Components/View/ViewStylePropTypes': 'react-native-web/dist/exports/ViewStylePropTypes',
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter': 'react-native-web/dist/vendor/react-native/Animated/NativeAnimatedHelper',
    'react-native/Libraries/Renderer/shims/ReactNative': 'react-native-web/dist/modules/ReactNative',
    'react-native/Libraries/Utilities/verifyComponentId': 'react-native-web/dist/modules/verifyComponentId',
  };
  return config;
};
