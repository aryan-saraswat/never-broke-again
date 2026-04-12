import { useBoardStore } from "../store/useBoardStore";
import Column from "./Column";

const COLUMN_ORDER = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const;

const Board = () => {
  const columns = useBoardStore((state) => state.columns);

  return (
    <div className="board-container">
      {COLUMN_ORDER.map((columnId) => {
        const col = columns[columnId];
        if (!col) return null;
        return <Column key={col.id} id={col.id} />;
      })}
    </div>
  );
};

export default Board;
