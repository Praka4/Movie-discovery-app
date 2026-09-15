function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    >
      <option value="popularity.desc">
        Most Popular
      </option>

      <option value="vote_average.desc">
        Highest Rated
      </option>

      <option value="primary_release_date.desc">
        Newest
      </option>

      <option value="revenue.desc">
        Highest Revenue
      </option>
    </select>
  );
}

export default SortSelect;