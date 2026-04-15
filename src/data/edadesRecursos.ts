export interface EdadRecurso {
  id: string;
  label: string;
  colorClass: string;
}

export const edadesRecursos: EdadRecurso[] = [
  {
    id: "jardin",
    label: "Jardin",
    colorClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-4 border-yellow-400",
  },
  {
    id: "1er-2do-grado",
    label: "1er y 2do grado",
    colorClass: "bg-green-100 text-green-800 hover:bg-green-200 border-4 border-green-400",
  },
  {
    id: "3er-4to-grado",
    label: "3er y 4to grado",
    colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-4 border-blue-400",
  },
  {
    id: "5to-6to-grado",
    label: "5to y 6to grado",
    colorClass: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-4 border-orange-400",
  },
  {
    id: "adolescencia",
    label: "Adolescencia",
    colorClass: "bg-red-100 text-red-800 hover:bg-red-200 border-4 border-red-400",
  },
  {
    id: "general",
    label: "General",
    colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-4 border-purple-400",
  },
];