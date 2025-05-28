export function createHistoryState(initialState = null) {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

export function saveHistoryState(history, newState, limit = 20) {
  // Clear redo history
  history.future = [];

  // Save current state to past
  if (history.present !== null) {
    history.past.push(JSON.parse(JSON.stringify(history.present)));
  }

  // Limit past size
  if (history.past.length > limit) {
    history.past.shift();
  }

  // Update present
  history.present = JSON.parse(JSON.stringify(newState));
}

export function undoState(history) {
  if (history.past.length === 0) return null;

  history.future.unshift(JSON.parse(JSON.stringify(history.present)));
  history.present = history.past.pop();

  return JSON.parse(JSON.stringify(history.present));
}

export function redoState(history) {
  if (history.future.length === 0) return null;

  history.past.push(JSON.parse(JSON.stringify(history.present)));
  history.present = history.future.shift();

  return JSON.parse(JSON.stringify(history.present));
}
