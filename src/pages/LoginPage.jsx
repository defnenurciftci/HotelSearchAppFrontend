import React, { useState } from "react"

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = (e) => {
        e.preventDefault();
        alert(`Giriş Yapıldı: ${email}`);
    };
    return (
        <div>
            <form onSubmit={handleLogin} style={{ marginTop: "20px", border: "1px solid #ccc", padding: "1rem" }}>
                <h3>Giriş Yap</h3>
                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Giriş Yap</button>
            </form>
        </div>
    )
}

export default LoginPage