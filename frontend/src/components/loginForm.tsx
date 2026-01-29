const LoginForm = ({ onSwitch }: { onSwitch?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <form className="flex flex-col items-center w-full max-w-md">
        <h2 className="text-center font-bold text-2xl mb-4">Login</h2>
        <p className="text-base text-center mb-6 text-gray-500">
          Voer alsjeblieft je e-mail en wachtwoord in
        </p>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-[#DECDB7] hover:bg-[#CBB89A] cursor-pointer duration-100 transition-all text-black font-semibold rounded py-3 mb-3 mt-2 text-lg"
        >
          Login
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
