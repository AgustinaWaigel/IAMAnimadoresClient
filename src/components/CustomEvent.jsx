export default function CustomEvent({ event }) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <span className="font-semibold text-xs">{event.title}</span>
      </div>
    );
  }
  