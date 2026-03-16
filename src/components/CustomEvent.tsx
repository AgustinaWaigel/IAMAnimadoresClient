import type { Evento } from "../types";

export default function CustomEvent({ event }: { event: Evento }) {
  return (
    <div className="text-xs font-medium text-white whitespace-normal break-words leading-snug px-1">
      {event.title}
    </div>
  );
}
