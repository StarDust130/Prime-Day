"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Flame,
  Trophy,
  Loader2,
  Check,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MascotLoading from "@/components/ui/MascotLoading";

interface Friend {
  _id: string;
  username: string;
  completedToday: number;
  streak: number;
}

interface SearchResult {
  _id: string;
  username: string;
  status: "none" | "pending_sent" | "pending_received" | "accepted";
}

interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  status: string;
}

export default function FriendsPage() {
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState<"friends" | "search" | "requests">(
    "friends"
  );

  // Data States
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriends();
    } else if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab]);

  // Debounced Search Effect
  useEffect(() => {
    if (activeTab === "search") {
      const delayDebounceFn = setTimeout(() => {
        if (searchQuery.trim()) {
          performSearch(searchQuery);
        } else {
          setSearchResults([]);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, activeTab]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friends");
      const data = await res.json();
      if (data.friends) {
        setFriends(data.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friends/request");
      const data = await res.json();
      if (data.incoming) setIncomingRequests(data.incoming);
      if (data.outgoing) setOutgoingRequests(data.outgoing);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    setSearching(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.users) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (res.ok) {
        setSearchResults((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, status: "pending_sent" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRespondRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    setActionLoading(requestId);
    try {
      const res = await fetch("/api/friends/request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (res.ok) {
        setIncomingRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        if (action === "accept") {
          // In background, update friends list cache if needed
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const res = await fetch(`/api/friends/request?requestId=${requestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOutgoingRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-black">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFDE59] p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Users className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Friends</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6 pb-2 sticky top-[76px] z-10 bg-[#F8F9FA]">
        <div className="flex p-1 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {(["friends", "requests", "search"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all capitalize relative ${
                activeTab === tab
                  ? "bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}
              {tab === "requests" && incomingRequests.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4">
        <AnimatePresence mode="wait">
          {/* --- FRIENDS TAB --- */}
          {activeTab === "friends" && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading ? (
                <MascotLoading />
              ) : friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#E0E7FF] border-2 border-black flex items-center justify-center font-black text-xl text-[#4338ca]">
                        {friend.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{friend.username}</h3>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mt-1">
                          <span className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 text-orange-600">
                            <Flame className="w-3 h-3" />
                            {friend.streak} streak
                          </span>
                          <span className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100 text-yellow-600">
                            <Trophy className="w-3 h-3" />
                            {friend.completedToday} today
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl">
                  <div className="relative w-48 h-48 mb-4">
                    <Image
                      src="/anime-girl-6.png"
                      alt="No friends"
                      fill
                      className="object-contain opacity-80"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-black uppercase mb-2 text-gray-800">
                    No Friends Yet
                  </h3>
                  <p className="text-gray-500 font-medium max-w-xs mx-auto mb-6">
                    Connect with your friends to track habits together and stay
                    motivated!
                  </p>
                  <Button
                    onClick={() => setActiveTab("search")}
                    className="bg-[#FFDE59] text-black border-2 border-black hover:bg-[#FFDE59]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold"
                  >
                    Find Friends
                  </Button>
                </div>
              )}
            </motion.div>
          )}
          {/* --- REQUESTS TAB --- */}
          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {loading ? (
                <MascotLoading />
              ) : (
                <>
                  {/* Incoming Requests */}
                  <div>
                    <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                      Received
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                        {incomingRequests.length}
                      </span>
                    </h3>

                    {incomingRequests.length > 0 ? (
                      <div className="space-y-3">
                        {incomingRequests.map((req) => (
                          <div
                            key={req._id}
                            className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] border-2 border-black flex items-center justify-center font-bold text-lg text-[#4338ca]">
                                  {req.sender.username[0].toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-bold">
                                    {req.sender.username}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Wants to be friends
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleRespondRequest(req._id, "accept")
                                }
                                disabled={actionLoading === req._id}
                                className="flex-1 bg-[#88FF88] text-black border-2 border-black hover:bg-[#88FF88]/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                              >
                                {actionLoading === req._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Accept"
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRespondRequest(req._id, "reject")
                                }
                                disabled={actionLoading === req._id}
                                className="flex-1 bg-[#FF8888] text-black border-2 border-black hover:bg-[#FF8888]/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl">
                        <div className="relative w-32 h-32 mb-2">
                          <Image
                            src="/anime-girl-7.png"
                            alt="No requests"
                            fill
                            className="object-contain opacity-80"
                          />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          No new requests
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Outgoing Requests */}
                  <div>
                    <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-gray-500">
                      Sent
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {outgoingRequests.length}
                      </span>
                    </h3>

                    {outgoingRequests.length > 0 ? (
                      <div className="space-y-3">
                        {outgoingRequests.map((req) => (
                          <div
                            key={req._id}
                            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-lg text-gray-400">
                                {req.receiver.username[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-700">
                                  {req.receiver.username}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  Request pending...
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelRequest(req._id)}
                              disabled={actionLoading === req._id}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
                            >
                              {actionLoading === req._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Cancel"
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 backdrop-blur-sm border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="relative w-32 h-32 mb-2">
                          <Image
                            src="/anime-girl.png"
                            alt="No sent requests"
                            fill
                            className="object-contain opacity-60"
                          />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          No sent requests
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}{" "}
          {/* --- SEARCH TAB --- */}
          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-12 h-14 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-medium"
                />
              </div>

              <div className="space-y-3">
                {searching ? (
                  <MascotLoading />
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E0E7FF] border-2 border-black flex items-center justify-center font-bold text-lg text-[#4338ca]">
                          {user.username[0].toUpperCase()}
                        </div>
                        <h3 className="font-bold text-lg">{user.username}</h3>
                      </div>

                      {user.status === "none" && (
                        <Button
                          size="sm"
                          onClick={() => handleSendRequest(user._id)}
                          disabled={actionLoading === user._id}
                          className="bg-[#FFDE59] text-black border-2 border-black hover:bg-[#FFDE59]/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                        >
                          {actionLoading === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Add
                            </>
                          )}
                        </Button>
                      )}

                      {user.status === "pending_sent" && (
                        <Button
                          size="sm"
                          disabled
                          className="bg-gray-100 text-gray-500 border-2 border-gray-200 font-bold"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Sent
                        </Button>
                      )}

                      {user.status === "pending_received" && (
                        <Button
                          size="sm"
                          onClick={() => setActiveTab("requests")}
                          className="bg-blue-100 text-blue-700 border-2 border-blue-200 hover:bg-blue-200 font-bold"
                        >
                          Respond
                        </Button>
                      )}

                      {user.status === "accepted" && (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          <Check className="w-4 h-4" />
                          Friends
                        </div>
                      )}
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>No users found matching &quot;{searchQuery}&quot;</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    Type to search for friends
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
