"use client"

import { useState } from "react";

type Book = {
    id: number;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {thumbnail?: string}
        description?: string;
        infoLink?: string;
    };
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция поиска книг
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooks([]);
    setError(null);

    if (!query.trim()) return;

    setLoading(true);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch {
      setError("Ошибка при получении данных. Попробуйте позже.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-white w-full">
      <div className="flex flex-col min-h-screen justify-start items-center py-16">
        <div className="w-full max-w-lg bg-white/90 shadow-md rounded-2xl p-8 mb-10 border border-sky-200">
          <h1 className="text-3xl font-bold text-sky-700 mb-5 text-center tracking-tight drop-shadow-md">BookFinder</h1>
          <form 
          onSubmit={handleSearch}
          className="flex gap-3 justify-center"
          autoComplete="off"
          >
            <input type="text"
            value={query}
            onChange={e =>setQuery(e.target.value)}
            placeholder="Введите название книги или автора"
            className="flex-1 px-4 py-3 rounded-lg border-2 border-sky-200 focus:outline-none focus:ring-sky-300 font-medium bg-white"
            />

            <button 
            type="submit"
            className="cursor-pointer px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 active:scale=95 transition"
            
            >
              Искать
            </button>
          </form>
        </div>

      {/*Ответ по поиску*/}
      <div className="w-full max-w-3xl space-y-7">
        {loading && (
          <div className="text-center text-lg text-lg text-sky-700 font-bold animate-pulse">
            Загрузка...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold text-lg">{error}</div>
        )}
        {!loading && !error && books.length === 0 && query && (
          <div className="text-center text-gray-500 font-medium">Ничего не найдено.</div>
        )}
        
        {books.map(book => {
          const v = book.volumeInfo;
          return (
            <div
            key={book.id}
            className="flex flex-col sm:flex-row gap-5 items-center bg-white rounded-xl shadow border border-sky-100 px-5 py-6 transition">
                {v.imageLinks?.thumbnail ? (
                  <img src={v.imageLinks.thumbnail} alt={v.title}
                  className="w-28 h-40 object-contain flex-shrink-0 rounded-xl shadow border" 
                  />
                ) : (
                  <div className="w-28 h-40 bg-gray-100 flex items-centerjustify-center text-gray-400 rounded=xl">Нет&nbsp;обложки</div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-sky-800 mb-1">
                    {v.title}
                  </h2>
                  {v.authors && (
                    <p className="mb-2 sm:mb-1 text-gray-700 font-medium">
                      Автор: {v.authors.join(', ')}
                    </p>
                  )}
                  {v.description && (
                    <p className="text-gray-600 text-sm mb-2 sm:mb-4"></p>
                  )}
                  {v.infoLink && (
                    <a href={v.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 font-semibold underline underline-offset-4 hover:text-blue-500 transition"
                    >
                      Подробнее &rarr;
                    </a>
                  )}
                </div>
            </div>
          )
        })}


      </div>


      </div>
    </div>
  );
}