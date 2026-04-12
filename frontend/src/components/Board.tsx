import Column from "./Column";

// Placeholder data for Phase 1
const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist' },
  { id: 'applied', title: 'Applied' },
  { id: 'interview', title: 'Interviewing' },
  { id: 'offer', title: 'Offer' },
  { id: 'rejected', title: 'Rejected' },
];

const Board = () => {
  return (
    <div className="board-container">
      {COLUMNS.map((col) => (
        <Column key={col.id} title={col.title} id={col.id} />
      ))}
    </div>
  );
};

export default Board;
