// app/lib/ErrorBoundary.tsx
import React from 'react';
import { View, Text } from 'react-native';

export class ErrorBoundary extends React.Component<React.PropsWithChildren, {error?: any}> {
  state = { error: undefined as any };
  componentDidCatch(error: any) {
    console.log('ERROR BOUNDARY:', error?.stack || error);
    this.setState({ error });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:16}}>
          <Text>Une erreur est survenue.</Text>
          <Text selectable>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
