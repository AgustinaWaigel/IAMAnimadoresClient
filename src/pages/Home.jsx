import { useState } from "react";
import PostForm from "../features/posts/PostForm";
import PostList from "../features/posts/PostList";
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Muro de Publicaciones
      </h1>
      <PostForm setPosts={setPosts} />
      <PostList posts={posts} setPosts={setPosts} />
    </div>
  );
}
