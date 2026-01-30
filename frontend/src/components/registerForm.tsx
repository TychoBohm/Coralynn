import { useState } from "react";
import { register } from "../api/api";

const RegisterForm = ({ onSwitch }: { onSwitch?: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // check of wachtwoorden matchen
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    setLoading(true);

    try {
      await register({
        email,
        password,
        phone_number: phoneNumber || undefined,
        name: name || undefined,
      });
      setSuccess(true);
      // na 2 sec naar login switchen
      setTimeout(() => {
        if (onSwitch) onSwitch();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registratie mislukt");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-4 text-green-600">
            Account aangemaakt!
          </h2>
          <p className="text-gray-500">
            Je wordt doorgestuurd naar de login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <form
        className="flex flex-col items-center w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-bold text-xl sm:text-2xl mb-4">
          Registreer
        </h2>
        <p className="text-sm sm:text-base text-center mb-6 text-gray-500">
          Voer alsjeblieft de informatie hieronder in
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="text"
          placeholder="Naam (optioneel)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Telefoonnummer (optioneel)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="password"
          placeholder="Wachtwoord *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="password"
          placeholder="Herhaal wachtwoord *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D4B896] hover:bg-[#C4A57A] cursor-pointer duration-100 transition-all text-black font-semibold rounded py-3 mb-3 mt-2 text-lg disabled:opacity-50"
        >
          {loading ? "Bezig..." : "Registreer"}
        </button>
        <p className="text-sm text-center mt-2">
          Heb je al een account?{" "}
          <button
            type="button"
            className="underline text-[#836a47] hover:text-[#493c28] duration-100 transition-all cursor-pointer"
            onClick={onSwitch}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
