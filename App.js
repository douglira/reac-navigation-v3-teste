import React, {Component} from 'react';
import {StyleSheet, Text, View, PanResponder, ScrollView, Dimensions, Animated} from 'react-native';
import {createAppContainer, createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView} from 'react-navigation';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', marginVertical: 20,
    alignItems: 'center', marginVertical: 20,
    backgroundColor: '#F5FCFF',
  },
});

class Block extends Component {
  render() {
    return (
      <View style={{ height: 290, width: 300, backgroundColor: 'grey', ...this.props.style }} />
    );
  }
}

const AnimatedBlock = Animated.createAnimatedComponent(Block);

class Home extends Component {
  state = {
    translateYAnim: new Animated.Value(0),
    opacityAnim: new Animated.Value(1),
    heightAnim: new Animated.Value(290),
  }

  handleScroll = (event) => {
    const { y: height } = event.nativeEvent.contentOffset;
    const animate = height > 150;
    
    Animated.sequence([
      Animated.timing(
        this.state.heightAnim,
        {
          toValue: animate ? 0 : 290,
          duration: 200,
        }
      ),
      Animated.parallel([
        Animated.timing(
          this.state.translateYAnim,
          {
            toValue: animate ? -350 : 0,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.opacityAnim,
          {
            toValue: animate ? 0 : 1,
            duration: 200,
          }
        ),
      ])
    ]).start();
  }
  
  render() {
    return (
      <View>
        <AnimatedBlock
          style={{ 
            overflow: 'hidden',
            height: this.state.heightAnim,
            opacity: this.state.opacityAnim,
            transform: [
              { translateY: this.state.translateYAnim }
            ] 
          }}
        />
        <ScrollView onScroll={this.handleScroll} style={{flex: 1}}>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
          <Text style={{alignSelf: 'center', marginVertical: 200}}>Home</Text>
        </ScrollView>
      </View>
    );
  }
}

const Dashboard = () => (
  <View style={styles.container}>
    <Text>Dashboard</Text>
  </View>
)

const withDrawerPanResponder = (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          const { moveX, dx } = gestureState;
  
          if (moveX <= 65&& dx >= 10) {
            props.navigation.openDrawer();
          }
        },
      })
    }

    render() {
      return (
        <View {...this.panResponder.panHandlers} style={styles.container}>
          <WrappedComponent />
        </View>
      );
    }
  }
}

class DrawerContent extends Component {
  constructor(props) {
    super(props)

    const { width } = Dimensions.get('window');
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, dx, vx } = gestureState;
        const movedX = width - 65;

        if (moveX <= movedX && dx <= -10) {
          props.navigation.closeDrawer();
        }
      },
    })
  }
  
  render() {
    return (
      <ScrollView {...this.panResponder.panHandlers} >
        <SafeAreaView style={{flex: 1}} forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...this.props} />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const AppDrawer = createDrawerNavigator({
  Home: withDrawerPanResponder(Home),
  Dashboard: withDrawerPanResponder(Dashboard),
}, {
  initialRouteName: 'Home',
  contentComponent: DrawerContent,
})

const AppStack = createStackNavigator({
  AppDrawer,
}, {
  headerMode: 'float',
  initialRouteName: 'AppDrawer',
})


export default createAppContainer(AppStack)