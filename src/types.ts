// ─── Entidades del dominio ────────────────────────────────────────────────────

export interface User {
  _id?: string;
  id?: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'usuario';
  token: string;
  avatarUrl?: string;
  avatarDesc?: string;
}

/** Post del muro / DashboardPublicaciones */
export interface MuroPost {
  _id: string;
  contenido: string;
  categoria: string;
  tipoArchivo?: string;
  archivoUrl?: string | string[];
  autor?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  likedBy?: string[];
  likedByUser?: boolean;
  likes?: number;
}

/** Post simple (PostForm / PostList) */
export interface Post {
  _id: string;
  content: string;
  author?: {
    _id: string;
    email: string;
  };
  autor?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  titulo?: string;
  categoria?: string;
  contenido?: string;
  archivo?: string;
  tipoArchivo?: 'imagen' | 'pdf' | 'documento' | 'otro';
  archivoUrl?: string;
  fecha?: string;
}

/** Noticia/Recurso del panel de avisos */
export interface Noticia {
  _id: string;
  titulo: string;
  tipo: 'noticia' | 'recurso';
  contenido?: string;
  archivoUrl?: string;
  tipoArchivo?: 'imagen' | 'pdf' | 'documento' | 'texto' | 'otro';
  createdAt: string;
  autor?: {
    _id: string;
    username: string;
  };
}

/** Bloque de contenido para noticias con editor (CrearNoticiaBloques) */
export interface BloqueContenido {
  tipo: 'texto' | 'imagen';
  contenido: string;
}

export interface NoticiaBloque {
  _id: string;
  titulo: string;
  slug: string;
  tipo?: string;
  portadaUrl?: string;
  contenido: BloqueContenido[];
  autor?: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

/** Evento del calendario */
export interface Evento {
  _id?: string;
  title: string;
  start: Date | string;
  end: Date | string;
  color?: string;
  descripcion?: string;
}

/** Opción de avatar */
export interface AvatarOption {
  src: string;
  desc: string;
}

// ─── Tipos del AuthContext ────────────────────────────────────────────────────

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

/** Usuario de la lista de administración */
export interface UsuarioAdmin {
  _id: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  rol: 'admin' | 'usuario';
  avatarUrl?: string;
}
