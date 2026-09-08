import ShowCard from "./ShowCard.jsx";

export default function ShowGrid({ shows = [], linkToWatch = false, className = "" }) {
  if (!shows.length) return null;

  return (
    <div
      className={`rt-show-grid ${className}`}
    >
      {shows.map((show) => (
        <div key={show.id} className="min-w-0">
          <ShowCard {...show} linkToWatch={linkToWatch} />
        </div>
      ))}
    </div>
  );
}
