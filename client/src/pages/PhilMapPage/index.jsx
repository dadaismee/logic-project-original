import React from "react";
import "./App.css";

import ReactGraphVisNeibours from "./components/Graph/ReactGraphVisNeibours";

import MenuContainer from "./containers/MenuContainer/MenuContainer";
import InfoContainer from "./containers/InfoContainer/InfoContainer";

import Loader from "./components/Loader/Loader";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      edges: [],
      graph: null,
      graphRender: false,
      loading: false,
      selectedData: null,
      displayInfo: false,
      doubleClicked: null,
    };
  }

  handleUp = (nodes, edges) => {
    this.setState({ nodes, edges, graphRender: true });
  };

  toggleLoader = () => {
    const { loading } = this.state;
    this.setState({ loading: !loading });
  };

  handleSelectedUp = (selectedData) => {
    this.setState({ selectedData });
  };

  infoToggle = (bool) => {
    this.setState({ displayInfo: bool });
  };

  nodeUp = (doubleClicked) => {
    this.setState({ doubleClicked });
  };

  render() {
    const { graphRender, loading, selectedData, displayInfo, doubleClicked } =
      this.state;

    return (
      <div className="App">
        {displayInfo ? (
          <InfoContainer
            selectedData={selectedData}
            infoToggle={this.infoToggle}
            toggleLoader={this.toggleLoader}
            handleUp={this.handleUp}
          />
        ) : null}
        {graphRender ? (
          <ReactGraphVisNeibours
            nodeUp={this.nodeUp}
            nodes={this.state.nodes}
            edges={this.state.edges}
          />
        ) : null}

        {loading ? <Loader /> : null}

        <MenuContainer
          doubleClicked={doubleClicked}
          infoToggle={this.infoToggle}
          handleSelectedUp={this.handleSelectedUp}
          toggleLoader={this.toggleLoader}
          handleUp={this.handleUp}
        />
      </div>
    );
  }
}

export default App;
