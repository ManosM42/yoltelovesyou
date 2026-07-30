import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Send,
  LogOut,
  HelpCircle,
  Lock,
  Loader2,
  X,
  Vote,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Fan Community — Yolte" },
      {
        name: "description",
        content: "Fan wall, polls, leaderboard και Ask Yolte. Μπες στο community και πες το δικό σου.",
      },
      { property: "og:title", content: "Fan Community — Yolte" },
      { property: "og:description", content: "Post, vote, ρώτα. Το community του Yolte." },
    ],
  }),
  component: CommunityPage,
});

type Post = {
  id: string;
  text: string;
  image_url?: string;
  created_at: string;
  profiles?: { username: string; avatar_url?: string };
  post_likes?: { user_id: string }[];
};

type Question = {
  id: string;
  question: string;
  answer?: string;
  created_at: string;
};

type PollOption = {
  id: string;
  label: string;
  poll_votes?: { user_id: string }[];
};

type Poll = {
  id: string;
  question: string;
  poll_options: PollOption[];
};

export function CommunityPage() {
  const [session, setSession] = useState<any>(null);

  // Community Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Post State
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Comments State
  const [activePostComments, setActivePostComments] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: any[] }>({});
  const [commentDraft, setCommentDraft] = useState("");

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    fetchCommunityData();

    return () => subscription.unsubscribe();
  }, []);

  async function fetchCommunityData() {
    setLoading(true);

    // 1. Fetch Posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*, profiles!posts_user_id_fkey(username, avatar_url), post_likes(user_id)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    // 2. Fetch Q&A Topics
    const { data: qnaData } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. Fetch Polls & Votes
    const { data: pollData } = await supabase
      .from("polls")
      .select("*, poll_options(*, poll_votes(user_id))")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 4. Fetch Active Announcement Marquee
    const { data: annData } = await supabase
      .from("announcements")
      .select("text")
      .eq("is_active", true)
      .maybeSingle();

    if (postsData) setPosts(postsData);
    if (qnaData) setQuestions(qnaData);
    if (pollData) setActivePoll(pollData);
    if (annData) setAnnouncement(annData);

    setLoading(false);
  }

  // --- AUTH HANDLERS ---
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Συνδέθηκες επιτυχώς!");
        setShowAuthModal(false);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Ο λογαριασμός δημιουργήθηκε!");
        setShowAuthModal(false);
      }
    }
    setAuthLoading(false);
  }

  async function handleGoogleAuth() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/community" },
    });
    if (error) toast.error(error.message);
  }

  // --- CREATE POST HANDLER ---
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    if (!postText.trim() && !selectedFile) {
      toast.error("Γράψε ένα μήνυμα ή επίλεξε εικόνα.");
      return;
    }

    setUploading(true);
    let imageUrl: string | undefined = undefined;

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: postError } = await supabase.from("posts").insert([
        {
          user_id: session.user.id,
          text: postText.trim(),
          image_url: imageUrl,
          status: "approved",
        },
      ]);

      if (postError) throw postError;

      toast.success("Το post σου δημοσιεύτηκε!");
      setPostText("");
      setSelectedFile(null);
      fetchCommunityData();
    } catch (err: any) {
      toast.error("Σφάλμα δημοσίευσης: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  // --- POLL VOTE HANDLER ---
  async function handleVote(pollId: string, optionId: string) {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const { error } = await supabase.from("poll_votes").insert([
      {
        poll_id: pollId,
        option_id: optionId,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        toast.error("Έχεις ήδη ψηφίσει σε αυτή την ψηφοφορία!");
      } else {
        toast.error("Σφάλμα κατά την καταγραφή της ψήφου.");
      }
    } else {
      toast.success("Η ψήφος σου καταγράφηκε!");
      fetchCommunityData();
    }
  }

  // --- LIKES HANDLER ---
  async function handleLikeToggle(postId: string, currentLikes: any[]) {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const userId = session.user.id;
    const hasLiked = currentLikes?.some((l) => l.user_id === userId);

    if (hasLiked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    } else {
      await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }]);
    }

    fetchCommunityData();
  }

  // --- COMMENTS HANDLERS ---
  async function toggleComments(postId: string) {
    if (activePostComments === postId) {
      setActivePostComments(null);
      return;
    }

    setActivePostComments(postId);
    const { data } = await supabase
      .from("post_comments")
      .select("*, profiles!post_comments_user_id_fkey(username)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) {
      setCommentsMap((prev) => ({ ...prev, [postId]: data }));
    }
  }

  async function handleAddComment(postId: string) {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    if (!commentDraft.trim()) return;

    const { error } = await supabase.from("post_comments").insert([
      {
        post_id: postId,
        user_id: session.user.id,
        text: commentDraft.trim(),
      },
    ]);

    if (!error) {
      setCommentDraft("");
      toggleComments(postId);
    } else {
      toast.error("Σφάλμα κατά την προσθήκη σχολίου.");
    }
  }

  return (
    <div className="min-h-screen">
      {/* ==================== ΑΠΕΙΡΗ ΚΥΛΙΟΜΕΝΗ ΚΟΡΔΕΛΑ (SEAMLESS MARQUEE) ==================== */}
      {announcement && (
        <div className="relative w-full overflow-hidden bg-accent text-accent-foreground py-2.5 text-xs font-bold uppercase tracking-[0.25em] shadow-lg flex select-none">
          <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12 whitespace-nowrap">
            <span>🔥 {announcement.text}</span>
            <span>•</span>
            <span>{announcement.text}</span>
            <span>•</span>
            <span>{announcement.text}</span>
            <span>•</span>
          </div>
          <div aria-hidden="true" className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-12 whitespace-nowrap">
            <span>🔥 {announcement.text}</span>
            <span>•</span>
            <span>{announcement.text}</span>
            <span>•</span>
            <span>{announcement.text}</span>
            <span>•</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-accent uppercase">Community hub</p>
              <h1 className="mt-4 text-6xl leading-[0.9] sm:text-8xl">
                <span className="text-violet-chrome">Το Κίνημα</span>
              </h1>
              <p className="mt-5 max-w-xl text-muted-foreground">
                Εδώ δεν είσαι θεατής. Post, ψήφισε, αλληλεπίδρασε — το site το φτιάχνουμε μαζί.
              </p>
            </div>

            <div>
              {session ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-accent font-medium">Συνδεδεμένος</span>
                  <button
                    onClick={() => supabase.auth.signOut().then(() => setSession(null))}
                    className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:border-red-500 hover:text-red-500"
                  >
                    <LogOut className="size-3.5" /> Έξοδος
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-full border border-accent/60 px-7 py-3 text-xs tracking-[0.2em] text-accent uppercase transition-shadow hover:shadow-[var(--glow-accent)]"
                >
                  Σύνδεση / Fan Account
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* ==================== FAN WALL ==================== */}
          <section>
            <SectionHeading kicker="Fan wall" title="Ο τοίχος σας" />

            <form onSubmit={handleCreatePost} className="rounded-xl border border-border/70 bg-card p-5">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={session ? "Πες το δικό σου — φωτο από live, fan art, ό,τι έχεις." : "Συνδέσου για να δημοσιεύσεις στον τοίχο..."}
                disabled={!session}
                className="w-full resize-none rounded-lg border border-input bg-background/60 p-4 text-sm outline-none focus:border-accent disabled:opacity-50"
              />

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 p-2 text-xs">
                  <span className="truncate">{selectedFile.name}</span>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-red-400 hover:underline">
                    Αφαίρεση
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <label className={`flex items-center gap-2 text-xs text-accent cursor-pointer ${!session ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <ImageIcon className="size-4" />
                  <span>Φωτογραφία</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!session}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                  />
                </label>

                {session ? (
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[11px] tracking-[0.2em] text-primary-foreground uppercase disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Post
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white"
                  >
                    <Lock className="size-3.5" /> Σύνδεση
                  </button>
                )}
              </div>
            </form>

            {/* Posts Feed */}
            {loading ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">Φόρτωση δημοσιεύσεων...</p>
            ) : posts.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">Δεν υπάρχουν δημοσιεύσεις ακόμα.</p>
            ) : (
              <ul className="mt-6 space-y-6">
                {posts.map((p, i) => {
                  const likes = p.post_likes || [];
                  const hasLiked = session && likes.some((l) => l.user_id === session.user.id);
                  const comments = commentsMap[p.id] || [];

                  return (
                    <Reveal as="li" key={p.id} delay={i * 60}>
                      <article className="overflow-hidden rounded-xl border border-border/70 bg-card">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt="Fan Post"
                            loading="lazy"
                            className="max-h-[450px] w-full object-cover"
                          />
                        )}
                        <div className="p-5">
                          <p className="text-xs tracking-[0.2em] text-accent uppercase">
                            @{p.profiles?.username || "Fan"}
                          </p>
                          <p className="mt-2 text-sm text-foreground/90">{p.text}</p>

                          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground border-t border-border/40 pt-4">
                            <button
                              onClick={() => handleLikeToggle(p.id, likes)}
                              className={`flex items-center gap-2 transition-colors hover:text-accent ${
                                hasLiked ? "text-accent font-bold" : ""
                              }`}
                            >
                              <Heart className={`size-4 ${hasLiked ? "fill-accent" : ""}`} /> {likes.length}
                            </button>

                            <button
                              onClick={() => toggleComments(p.id)}
                              className="flex items-center gap-2 transition-colors hover:text-accent"
                            >
                              <MessageCircle className="size-4" /> Σχόλια
                            </button>
                          </div>

                          {/* Comments */}
                          {activePostComments === p.id && (
                            <div className="mt-4 border-t border-border/50 pt-4 space-y-3">
                              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                {comments.length === 0 ? (
                                  <p className="text-xs text-muted-foreground italic">Κανένα σχόλιο ακόμα.</p>
                                ) : (
                                  comments.map((c: any) => (
                                    <div key={c.id} className="rounded-lg bg-background/50 p-2 text-xs">
                                      <span className="font-bold text-accent">@{c.profiles?.username || "Fan"}: </span>
                                      <span>{c.text}</span>
                                    </div>
                                  ))
                                )}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <input
                                  type="text"
                                  placeholder={session ? "Γράψε ένα σχόλιο..." : "Συνδέσου για να σχολιάσεις"}
                                  disabled={!session}
                                  value={commentDraft}
                                  onChange={(e) => setCommentDraft(e.target.value)}
                                  className="w-full rounded-lg border border-border bg-background p-2 text-xs outline-none focus:border-accent disabled:opacity-50"
                                />
                                <button
                                  onClick={() => handleAddComment(p.id)}
                                  disabled={!session || !commentDraft.trim()}
                                  className="rounded-lg bg-accent px-3 py-2 text-xs text-white disabled:opacity-50"
                                >
                                  Στείλε
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ==================== POLLS & Q&A SIDEBAR ==================== */}
          <aside className="space-y-12">
            {/* Active Poll */}
            {activePoll && (
              <Reveal>
                <div className="rounded-xl border border-border/70 bg-card p-6">
                  <p className="flex items-center gap-2 text-xs tracking-[0.3em] text-accent uppercase">
                    <Vote className="size-4" /> Ψηφοφορία
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">{activePoll.question}</h2>

                  {(() => {
                    const totalVotes = activePoll.poll_options?.reduce(
                      (acc, opt) => acc + (opt.poll_votes?.length || 0),
                      0
                    ) || 0;

                    const hasVoted = session && activePoll.poll_options?.some(
                      (opt) => opt.poll_votes?.some((v) => v.user_id === session.user.id)
                    );

                    return (
                      <ul className="mt-5 space-y-3">
                        {activePoll.poll_options?.map((opt) => {
                          const votesCount = opt.poll_votes?.length || 0;
                          const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;

                          return (
                            <li key={opt.id}>
                              <button
                                onClick={() => handleVote(activePoll.id, opt.id)}
                                className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-accent"
                              >
                                <div className="flex items-center justify-between text-sm font-medium">
                                  <span>{opt.label}</span>
                                  {hasVoted && <span className="text-xs text-accent font-bold">{pct}%</span>}
                                </div>
                                {hasVoted && (
                                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                                  </div>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}
                </div>
              </Reveal>
            )}

            {/* Q&A Topics */}
            <Reveal>
              <div className="rounded-xl border border-border/70 bg-card p-6">
                <p className="flex items-center gap-2 text-xs tracking-[0.3em] text-accent uppercase">
                  <HelpCircle className="size-4" /> Ask Yolte (Q&A Topics)
                </p>
                {questions.length === 0 ? (
                  <p className="mt-4 text-xs text-muted-foreground">Δεν υπάρχει κάποιο ενεργό Q&A topic αυτή τη στιγμή.</p>
                ) : (
                  <ul className="mt-5 space-y-5">
                    {questions.map((q) => (
                      <li key={q.id} className="border-b border-border/40 pb-4 last:border-0">
                        <p className="text-sm font-bold text-accent">Q: {q.question}</p>
                        {q.answer && <p className="mt-1.5 text-xs text-muted-foreground italic">— {q.answer}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </aside>
        </div>

        {/* ==================== AUTH MODAL ==================== */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white"
              >
                <X className="size-5" />
              </button>

              <h2 className="text-2xl font-bold">
                {authMode === "login" ? "Είσοδος στο Community" : "Δημιουργία Fan Account"}
              </h2>

              <button
                onClick={handleGoogleAuth}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-xs font-semibold hover:border-accent"
              >
                Σύνδεση με Google
              </button>

              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px w-full bg-border" />
                <span>ή</span>
                <div className="h-px w-full bg-border" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:border-accent"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Κωδικός..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:border-accent"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-lg bg-accent py-3 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
                >
                  {authLoading ? "Περιμένετε..." : authMode === "login" ? "Είσοδος" : "Εγγραφή"}
                </button>
              </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-xs text-muted-foreground hover:text-accent underline"
              >
                {authMode === "login" ? "Δεν έχεις λογαριασμό; Εγγραφή" : "Έχεις ήδη λογαριασμό; Είσοδος"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}