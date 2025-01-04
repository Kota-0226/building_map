import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/map', { replace: true }); // 既存セッションがある場合は/mapにリダイレクト
      }
    };

    checkSession();
  }, [navigate]);

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      alert('登録が完了しました！メールを確認してください。');
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/map', { replace: true }); // ログイン成功後にリダイレクト
      window.location.reload(); // 強制的に再レンダリング
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brown-600 mb-6 text-center">ログインまたは新規登録</h1>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-brown-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-brown-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brown-400 mb-4"
        >
          ログイン
        </button>
        <button
          onClick={handleSignup}
          className="w-full bg-white border border-blue-400 text-blue-400 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brown-300"
        >
          新規登録
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};