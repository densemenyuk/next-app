"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{fontSize: 32}}>BookFinder</h1>
      <form onSubmit={handleSubmit} style={{display: "flex", gap: 8}}>
        <input type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Ввидите название книги или автора"
        style={{padding: 8, minWidth: 290}}
        />
        <button type="submit" style={{padding: 8}}>Поиск</button>
      </form>
    </main>
  );
}
