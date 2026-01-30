import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchFromApi } from "../api/api";

const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await fetchFromApi("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          phone_number: phoneNumber || null,
          address: address || null,
        }),
      });
      await refreshUser();
      setEditing(false);
      setMessage("Profiel bijgewerkt!");
    } catch (err) {
      setMessage("Kon profiel niet opslaan");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-5">
      <h2 className="text-4xl font-extrabold mb-6">Profiel</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.includes("niet") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <p className="text-lg">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Telefoonnummer
          </label>
          {editing ? (
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Voer telefoonnummer in"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">{user.phone_number || "Niet ingesteld"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Adres
          </label>
          {editing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Voer adres in"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          ) : (
            <p className="text-lg">{user.address || "Niet ingesteld"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Lid sinds
          </label>
          <p className="text-lg">
            {new Date(user.created_at).toLocaleDateString("nl-NL")}
          </p>
        </div>

        <div className="pt-4">
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#D4B896] hover:bg-[#c9ad87] px-6 py-2 rounded font-semibold disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Opslaan..." : "Opslaan"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setPhoneNumber(user.phone_number || "");
                  setAddress(user.address || "");
                }}
                className="border border-gray-300 px-6 py-2 rounded cursor-pointer"
              >
                Annuleren
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-[#D4B896] hover:bg-[#c9ad87] px-6 py-2 rounded font-semibold cursor-pointer"
            >
              Bewerken
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
