import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Giriş Yapıldı: ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fef9ff] font-sans">
      <form
        onSubmit={handleLogin}
        className="bg-[#f2dfd7] shadow-md p-8 w-full max-w-md text-[#333] border border-[#d4c1ec]"
      >
        <h3 className="text-2xl font-semibold mb-6 text-[#8986c8] text-center">Giriş Yap</h3>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-[#adadf6] bg-white placeholder-[#adadf6] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8986c8]"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 border border-[#adadf6] bg-white placeholder-[#adadf6] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#8986c8]"
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#8986c8] text-white hover:bg-[#6f6cb3] transition duration-200"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
