export default function Leaderboard({ entries }) {
  return (
    <section className="leaderboard">
      <h3>Top Career Runs</h3>
      {entries.length === 0 ? (
        <p>No runs yet. Finish all missions to post a score.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={`${entry.name}-${entry.completedAt}-${index}`}>
              <span>#{index + 1}</span>
              <span>{entry.name}</span>
              <strong>{entry.careerPoints}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
