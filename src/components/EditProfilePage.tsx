import { useRef, useState } from "react";
import { ArrowLeft, Camera, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { imageUrl, uploadFile } from "../lib/api";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [previewUrl, setPreviewUrl] = useState(imageUrl(profile?.profile_image));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    setPreviewUrl(URL.createObjectURL(file));

    // upload
    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await uploadFile<{ user: { profile_image: string } }>("/auth/update", formData);
      setPreviewUrl(imageUrl(res.user.profile_image));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "Failed to upload image");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ name, email });
      navigate(-1);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      setError(apiErr.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F5]">
      <div className="min-h-screen bg-[#F8F9FA] shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative flex flex-col">
        <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-[#F8F9FA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#EDEEEF]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#0F5238]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#0F5238]">Edit Profile</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto pt-20 pb-32 px-5 space-y-8">
          {/* Profile Picture */}
          <section className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-[#F8F9FA] shadow-[0_8px_16px_rgba(15,82,56,0.08)] overflow-hidden object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#0F5238] border-2 border-[#F8F9FA] flex items-center justify-center"
                aria-label="Change photo"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </section>

          {/* Edit Form */}
          <section className="space-y-4">
            {error && (
              <div className="bg-[#FFDAD6] text-[#BA1A1A] text-sm p-3 rounded-lg">{error}</div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-[0.05em] text-[#404943]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#707973] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#BFC9C1] rounded-lg py-3 pl-10 pr-3 bg-[#F8F9FA] text-sm text-[#191C1D]"
                />
              </div>
            </div>
          </section>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-[#F8F9FA] border-t border-[#E1E3E4] px-5 py-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#E7E8E9] text-[#191C1D] text-xs font-semibold tracking-[0.05em] py-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#0F5238] text-white text-xs font-semibold tracking-[0.05em] py-4 rounded-lg shadow-[0_4px_12px_rgba(15,82,56,0.2)] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
