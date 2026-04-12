import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "../store/useBoardStore";
import { ColumnId } from "../types";
import Column from "./Column";

const COLUMN_ORDER = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const;

const Board = () => {
  const columns = useBoardStore((state) => state.columns);
  const moveJob = useBoardStore((state) => state.moveJob);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveJob(
      draggableId,
      source.droppableId as ColumnId,
      destination.droppableId as ColumnId,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-container">
        {COLUMN_ORDER.map((columnId) => {
          const col = columns[columnId];
          if (!col) return null;
          return <Column key={col.id} id={col.id} />;
        })}
      </div>
    </DragDropContext>
  );
};

export default Board;
