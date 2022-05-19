import React from "react";
import { TextInput, View } from "react-native";

export default class ExpandingTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      initialHeight: 0,
    };
  }

  focus() {
    this.textInput && this.textInput.focus();
  }

  render() {
    return (
      <TextInput
        autoCorrect={false}
        {...this.props}
        ref={(view) => (this.textInput = view)}
        multiline
        onContentSizeChange={(event) => {
          if (event && event.nativeEvent && event.nativeEvent.contentSize) {
            if (this.state.initialHeight == 0) {
              this.setState({
                height: event.nativeEvent.contentSize.height,
                initialHeight: event.nativeEvent.contentSize.height,
              });
            } else {
              this.setState({
                height: event.nativeEvent.contentSize.height,
                initialHeight: this.state.initialHeight,
              });
            }
          }
          this.props.onContentSizeChange &&
            this.props.onContentSizeChange(event);
        }}
        style={[
          this.props.style,
          {
            height: Math.max(40, this.state.height),
            marginBottom: Math.max(0, this.state.initialHeight),
            paddingTop: 12,
          },
        ]}
      />
    );
  }
}
