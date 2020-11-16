import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.css";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default class DragDropSection extends Component {
  state = {
    items: this.props.items,
    selected: this.props.selected,
    open: false,
    buttonText: ""
  };
  componentDidMount() {
    if (window.localStorage.getItem("items") !== null) {
      this.setState({
        items: JSON.parse(window.localStorage.getItem("items"))
      });
    }
    if (window.localStorage.getItem("selected") !== null) {
      this.setState({
        selected: JSON.parse(window.localStorage.getItem("selected"))
      });
    }
  }
  id2List = {
    droppable: "items",
    droppable2: "selected"
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      this.setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: true });
  };
  onClickSave = (items, selected) => {
    window.localStorage.setItem("items", JSON.stringify(items));
    window.localStorage.setItem("selected", JSON.stringify(selected));
    this.setState({ open: true, buttonText: "saved" });
  };
  onClickClear = () => {
    window.localStorage.clear();
    window.location.reload();
    this.setState({ clear: true, buttonText: "cleared" });
  };
  render() {
    <Snackbar
      open={this.state.open}
      autoHideDuration={6000}
      onClose={this.handleClose}
    >
      <Alert onClose={this.handleClose} severity="success">
        `The list has been ${this.state.buttonText}`
      </Alert>
    </Snackbar>;

    return (
      <>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="dragndrop">
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  className="draggableList"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="list-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div className="dropArea" ref={provided.innerRef}>
                  {this.state.selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="list-item"
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        <div className="footer">
          <button
            className="save"
            onClick={() =>
              this.onClickSave(this.state.items, this.state.selected)
            }
          >
            Save
          </button>
          <button className="clear" onClick={() => this.onClickClear()}>
            Clear
          </button>
        </div>
      </>
    );
  }
}
