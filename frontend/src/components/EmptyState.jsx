function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <h2>Nothing here</h2>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;