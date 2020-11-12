import React from "react";
import DragDropSection from "./DragDropSection";
import Header from "./Header";

const originalDashboards = [
  { id: "1", isActive: "false", name: "Text" },
  { id: "1", isActive: "false", name: "Input Area" },
  { id: "1", isActive: "false", name: "Select" },
  { id: "1", isActive: "false", name: "Paragraph" },
  { id: "1", isActive: "false", name: "Heading" },
  { id: "1", isActive: "false", name: "Button" }
];

class App extends React.Component {
  state = {
    dashboardList: [],
    selectedDashboards: []
  };
  componentDidMount() {
    this.getDashboards();
  }
  getDashboards = () => {
    const selectedDashboards = originalDashboards.filter(
      dashboard => dashboard.isActive === true
    );
    this.setState({ selectedDashboards: selectedDashboards });
  };
  resetDashboards = () => {
    this.setState({
      dashboardList: originalDashboards.filter(
        dashboard => dashboard.isActive === false
      ),
      selectedDashboards: originalDashboards.filter(
        dashboard => dashboard.isActive === true
      )
    });
  };
  render() {
    return (
      <>
        {/* <DraggingComponent />
      <DroppingComponent /> */}
        {/* <DragDropSection /> */}
        <Header />
        <DragDropSection
          listItems={originalDashboards}
          selectedList={this.state.selectedDashboards}
        />
        <div className="footer">
          <button>Reset</button>
          <button>Clear</button>
        </div>
      </>
    );
  }
}

export default App;
