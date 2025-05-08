import { useEffect, useState } from 'react';

export function useMovies(query, API_KEY, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    callback?.();
    // useEffect内で直接async関数は使えないため、内部でasync関数を定義して呼び出す
    async function fetchMovies() {
      try {
        setIsLoading(true); // ローディング開始ß
        setError('');
        // APIから映画データを取得
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );
        // fetchが失敗した場合のエラーハンドリング
        if (!res.ok) {
          throw new Error('Something went wrong with fetching movies');
        }
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error('No movies found');
        }
        setMovies(data.Search);
      } catch (err) {
        // エラーをコンソールに出力
        console.error(err.message);
        setError(err.message); // エラーメッセージをstateに保存
      } finally {
        setIsLoading(false); // ローディング終了
      }
    }

    if (query.length < 3) {
      setMovies([]); // クエリが3文字未満の場合は映画データを空にする
      return;
    }

    fetchMovies(); // 定義したasync関数を実行
  }, [query]);

  return { movies, isLoading, error }; // 映画データ、ローディング状態、エラーメッセージを返す
}
