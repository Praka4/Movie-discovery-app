function GenreSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    >
      <option value="">All Genres</option>
      <option value="28">Action</option>
      <option value="12">Adventure</option>
      <option value="16">Animation</option>
      <option value="35">Comedy</option>
      <option value="18">Drama</option>
      <option value="27">Horror</option>
      <option value="10749">Romance</option>
      <option value="878">Science Fiction</option>
      <option value="53">Thriller</option>
    </select>
  );
}

export default GenreSelect;