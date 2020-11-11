import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const businessTypes = {
  Input: "input",
  TextArea: "textarea"
};

export default class DragDropSection extends React.Component {
  onDragEnd = result => {
    // return if item was dropped outside
    if (!result.destination) return;
    // return if the item was dropped in the same place
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;
    // Moving from one list to another
    if (result.source.droppableId === "droppable") {
      // get the items array
      const sourceListItems = [...this.props.listItems];
      // get the draggedItems
      const draggedItem = sourceListItems[result.source.index];
      sourceListItems.splice(result.source.index, 1);
      const destListItems = [...this.props.selectedList];
      destListItems.splice(result.destination.index, 0, draggedItem);
      this.props.updateListItems(sourceListItems, destListItems);
    } else {
      // get the items array
      const sourceListItems = [...this.props.selectedList];
      // get the draggedItems
      const draggedItem = sourceListItems[result.source.index];
      sourceListItems.splice(result.source.index, 1);
      const destListItems = [...this.props.listItems];
      destListItems.splice(result.destination.index, 0, draggedItem);
      this.props.updateListItems(destListItems, sourceListItems);
    }
  };
  render() {
    console.log(this.props.listItems, "listitems");
    console.log(this.props.selectedList, "selectedList");

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="dragndrop">
          <Droppable droppableId={"droppable"}>
            {(provided, snapshot) => (
              <div
                className="draggableList"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {this.props.listItems.map((item, index) => {
                  return (
                    <Draggable
                      draggableId={item.id.toString()}
                      key={item.name}
                      index={index}
                    >
                      {provided => (
                        <div
                          className={
                            this.props.tab ? "image-list" : "list-item"
                          }
                          key={`${item.id}_${item.id}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {!this.props.tab && item.name}
                          {this.props.tab && (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: businessTypes[item.name]
                              }}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId={"droppable2"}>
            {(provided, snapshot) => (
              <div
                className="dropArea"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {this.props.selectedList.map((item, index) => {
                  return (
                    <Draggable
                      draggableId={item.id.toString()}
                      key={item.name}
                      index={index}
                    >
                      {provided => (
                        <div
                          className={
                            this.props.tab ? "image-list" : "list-item"
                          }
                          key={`${item.id}_${item.name}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {!this.props.tab && item.name}
                          {this.props.tab && (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: businessTypes[item.name]
                              }}
                            />
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {this.props.listItems.length === 0 && (
                  <p>
                    Drag and drop the logo icons in the sequence of your
                    importance.
                  </p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  }
}
