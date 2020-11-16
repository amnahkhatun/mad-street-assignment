import React from "react";
import DragDropSection from "./DragDropSection";
import Header from "./Header";
import items from "./items";
class App extends React.Component {
  state = {
    items: items,
    selected: []
  };

  render() {
    return (
      <>
        <Header />
        {this.state.items && (
          <DragDropSection
            items={this.state.items}
            selected={this.state.selected}
          />
        )}
      </>
    );
  }
}

export default App;
