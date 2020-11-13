// import React from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import "./style.css";

// const businessTypes = {
//   Input: "input",
//   TextArea: "textarea"
// };

// export default class DragDropSection extends React.Component {
//   onDragEnd = result => {
//     // return if item was dropped outside
//     if (!result.destination) return;
//     // return if the item was dropped in the same place
//     if (
//       result.source.droppableId === result.destination.droppableId &&
//       result.source.index === result.destination.index
//     )
//       return;
//     // Moving from one list to another
//     if (result.source.droppableId === "droppable") {
//       // get the items array
//       const sourceListItems = [...this.props.listItems];
//       // get the draggedItems
//       const draggedItem = sourceListItems[result.source.index];
//       sourceListItems.splice(result.source.index, 1);
//       const destListItems = [...this.props.selectedList];
//       destListItems.splice(result.destination.index, 0, draggedItem);
//       // this.props.updateListItems(sourceListItems, destListItems);
//     } else {
//       // get the items array
//       const sourceListItems = [...this.props.selectedList];
//       // get the draggedItems
//       const draggedItem = sourceListItems[result.source.index];
//       sourceListItems.splice(result.source.index, 1);
//       const destListItems = [...this.props.listItems];
//       destListItems.splice(result.destination.index, 0, draggedItem);
//       // this.props.updateListItems(destListItems, sourceListItems);
//     }
//   };
//   render() {
//     console.log(this.props.listItems, "listitems");
//     console.log(this.props.selectedList, "selectedList");

//     return (
//       <DragDropContext onDragEnd={this.onDragEnd}>
//         <div className="dragndrop">
//           <Droppable droppableId={"droppable"}>
//             {(provided, snapshot) => (
//               <div
//                 className="draggableList"
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {this.props.listItems.map((item, index) => {
//                   return (
//                     <Draggable
//                       draggableId={item.id}
//                       key={item.name}
//                       index={index}
//                     >
//                       {provided => (
//                         <div
//                           // className={
//                           //   this.props.tab ? "image-list" : "list-item"
//                           // }
//                           className="list-item"
//                           key={`${item.id}_${item.id}`}
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           {console.log(item.name, "item-name")}

//                           {!this.props.tab && item.name}
//                           {this.props.tab && (
//                             <span
//                               dangerouslySetInnerHTML={{
//                                 __html: businessTypes[item.name]
//                               }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//           <Droppable droppableId={"droppable2"}>
//             {(provided, snapshot) => (
//               <div
//                 className="dropArea"
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {this.props.selectedList.map((item, index) => {
//                   return (
//                     <Draggable
//                       draggableId={item.id.toString()}
//                       key={item.name}
//                       index={index}
//                     >
//                       {provided => (
//                         <div
//                           // className={
//                           //   this.props.tab ? "image-list" : "list-item"
//                           // }
//                           className="list-item"
//                           key={`${item.id}_${item.name}`}
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           {!this.props.tab && item.name}
//                           {this.props.tab && (
//                             <span
//                               dangerouslySetInnerHTML={{
//                                 __html: businessTypes[item.name]
//                               }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {this.props.listItems.length === 0 && (
//                   <p>
//                     Drag and drop the logo icons in the sequence of your
//                     importance.
//                   </p>
//                 )}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     );
//   }
// }

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.css";
// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

export default class DragDropSection extends Component {
  state = {
    items: getItems(10),
    selected: getItems(5, 10)
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="dragndrop">
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                className="draggableList"
                ref={provided.innerRef}
                {...provided.droppableProps}
                // style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.props.listItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="list-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // style={getItemStyle(
                        //     snapshot.isDragging,
                        //     provided.draggableProps.style
                        // )}
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
              <div
                className="dropArea"
                ref={provided.innerRef}
                // style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.selected.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="list-item"
                        // style={getItemStyle(
                        //     snapshot.isDragging,
                        //     provided.draggableProps.style
                        // )}
                      >
                        {item.content}
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
    );
  }
}

// Put the things into the DOM!
