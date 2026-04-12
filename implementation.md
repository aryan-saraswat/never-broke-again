# Job Application Tracker - Kanban Board Plan

This plan outlines the strategy for building your Kanban-style job application tracker using React and Vite.

## Proposed Architecture & Tech Stack

*   **Frontend Framework:** React + Vite + TypeScript (Already initiated)
*   **State Management:** React Context API or Zustand (recommended for Kanban boards due to frequent drag-and-drop state updates).
*   **Drag and Drop Library:** `@hello-pangea/dnd` (a modern, maintained fork of `react-beautiful-dnd`) or `@dnd-kit/core`.
*   **Styling:** Modern Vanilla CSS (using CSS Grid for the board and Flexbox for columns/cards) aiming for a clean, premium "glassmorphism" or dark mode aesthetic.
*   **Data Persistence:** `localStorage` for the MVP so it works instantly in the browser without needing a backend database yet.

---

## Data Model

We will need TypeScript interfaces to define our core data:

*   **`Job` (Card):**
    *   `id` (unique string)
    *   `company` (string)
    *   `role` (string)
    *   `status` (matches a column id)
    *   `dateApplied` (date)
    *   `salary` (optional string)
    *   `notes` (optional string)
*   **`Column` (Stage):**
    *   `id` (unique string: e.g., 'wishlist', 'applied', 'interview', 'offer', 'rejected')
    *   `title` (string)
    *   `jobIds` (array of strings, dictating the order of cards)
*   **`BoardState`:**
    *   An object mapping column IDs to `Column` objects, and an object mapping job IDs to `Job` objects.

---

## Implementation Sequence

### Phase 1: Foundation Setup
*   Initialize standard project directory structure (`src/components`, `src/types`, `src/store`, `src/styles`).
*   Set up a global CSS file with premium design tokens (colors, typography, shadows, border-radiuses).
*   Create placeholder components for the Board, Columns, and Cards.

### Phase 2: State & Data Management
*   Define the TypeScript types (`types.ts`).
*   Set up the global state store with initial mockup data (a few fake job applications).
*   Create functions to handle state updates (moving a card, adding a card, deleting a card).

### Phase 3: UI Construction
*   **`Board` Component:** A horizontal scrolling container matching the screen height.
*   **`Column` Component:** A vertical container that renders job cards based on the state.
*   **`JobCard` Component:** A clean, scannable card showing the job title, company name, and a small visual indicator of the date applied.
*   **`AddJobModal` Component:** A form to input new job details.

### Phase 4: Drag and Drop Interactivity
*   Integrate the drag-and-drop library.
*   Wrap the `Board` in a Drag Drop Context.
*   Make `Column`s drop zones (Droppables).
*   Make `JobCard`s draggable items (Draggables).
*   Hook up the `onDragEnd` event to update our global state, moving items between columns and reordering them visually.

### Phase 5: Persistence & Polish
*   Add a local storage sync so data isn't lost on refresh.
*   Add micro-animations (e.g., subtle hover effects on cards, smooth modal transitions).
*   Ensure the design looks visually impressive and high-end, utilizing good spacing and typography.
