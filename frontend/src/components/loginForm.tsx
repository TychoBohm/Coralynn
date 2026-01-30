import { useState } from "react";
import { login } from "../api/api";

const LoginForm = ({
  onSwitch,
  onSuccess,
}: {
  onSwitch?: () => void;
  onSuccess?: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      // login gelukt, redirect of callback
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login mislukt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <form
        className="flex flex-col items-center w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-bold text-xl sm:text-2xl mb-4">
          Login
        </h2>
        <p className="text-sm sm:text-base text-center mb-6 text-gray-500">
          Voer alsjeblieft je e-mail en wachtwoord in
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#DECDB7] hover:bg-[#CBB89A] cursor-pointer duration-100 transition-all text-black font-semibold rounded py-3 mb-3 mt-2 text-lg disabled:opacity-50"
        >
          {loading ? "Bezig..." : "Login"}
        </button>
        <p className="text-sm text-center mt-2">
          Nog geen account?{" "}
          <button
            type="button"
            className="underline text-[#836a47] hover:text-[#493c28] duration-100 transition-all cursor-pointer"
            onClick={onSwitch}
          >
            Registreer
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
