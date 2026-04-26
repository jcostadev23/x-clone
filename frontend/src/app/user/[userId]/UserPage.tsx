"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { ProfileUser } from "@/types";
import { follow, unfollow, updateProfile } from "@/utils/apiCalls";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HiOutlineMail, HiOutlinePencil } from "react-icons/hi";

type Props = {
  userId: string;
  initialUser: ProfileUser;
  isOwnProfile: boolean;
  initialFollowed: boolean;
};

const UserPage: React.FC<Props> = ({ userId, initialUser, isOwnProfile, initialFollowed }) => {
  const { startLoading, stopLoading } = useAppContext();
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [followersCount, setFollowersCount] = useState(initialUser.followersCount ?? 0);
  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState(initialUser.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [savedBio, setSavedBio] = useState(initialUser.bio ?? "");

  const handleFollow = useCallback(async () => {
    setIsFollowed(true);
    setFollowersCount((c) => c + 1);
    startLoading();
    const resp = await follow(userId);
    stopLoading();
    if (!resp?.success) {
      setIsFollowed(false);
      setFollowersCount((c) => c - 1);
    }
  }, [startLoading, stopLoading, userId]);

  const handleUnfollow = useCallback(async () => {
    setIsFollowed(false);
    setFollowersCount((c) => Math.max(0, c - 1));
    startLoading();
    const resp = await unfollow(userId);
    stopLoading();
    if (!resp?.success) {
      setIsFollowed(true);
      setFollowersCount((c) => c + 1);
    }
  }, [startLoading, stopLoading, userId]);

  const handleSaveProfile = useCallback(async () => {
    setSaving(true);
    const resp = await updateProfile({ bio });
    setSaving(false);
    if (resp?.success) {
      setSavedBio(bio);
      setEditOpen(false);
    }
  }, [bio]);

  if (isOwnProfile) {
    return (
      <>
        <button
          onClick={() => { setBio(savedBio); setEditOpen(true); }}
          className="border border-[#CFD9DE] text-[#0F1419] font-bold rounded-full px-4 py-1.5 text-[15px] hover:bg-[#E7E7E8] transition-colors flex items-center gap-1.5"
        >
          <HiOutlinePencil size={16} />
          Edit profile
        </button>

        {/* Edit profile modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-[600px] mx-4 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EFF3F4]">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="p-2 rounded-full hover:bg-[#E7E7E8] transition-colors text-[#0F1419] font-bold text-[17px]"
                  >
                    ✕
                  </button>
                  <h2 className="text-[20px] font-bold text-[#0F1419]">Edit profile</h2>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-[#0F1419] hover:bg-[#272C30] text-white font-bold rounded-full px-4 py-1.5 text-[15px] transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="p-4">
                <div className="border border-[#CFD9DE] rounded-md px-3 pt-2 pb-1 focus-within:border-[#1D9BF0] transition-colors">
                  <label className="text-[12px] text-[#536471]">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    className="w-full text-[17px] text-[#0F1419] outline-none resize-none mt-0.5"
                    placeholder="Your bio"
                  />
                  <div className="text-right text-[12px] text-[#536471]">{bio.length}/160</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/messages/${userId}`}
        className="border border-[#CFD9DE] text-[#0F1419] rounded-full p-2 hover:bg-[#E7E7E8] transition-colors"
        title="Message"
      >
        <HiOutlineMail size={18} />
      </Link>

      {isFollowed ? (
        <button
          onClick={handleUnfollow}
          className="border border-[#CFD9DE] text-[#0F1419] font-bold rounded-full px-4 py-1.5 text-[15px] hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className="bg-[#0F1419] hover:bg-[#272C30] text-white font-bold rounded-full px-4 py-1.5 text-[15px] transition-colors"
        >
          Follow
        </button>
      )}

      {/* Expose followers count update to parent via hidden element */}
      <span data-followers={followersCount} className="hidden" />
    </div>
  );
};

export default UserPage;
