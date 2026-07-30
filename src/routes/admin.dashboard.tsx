import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  ShieldAlert,
  Ticket,
  Trash2,
  Vote,
  MapPin,
  ExternalLink,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  Megaphone,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/admin/login" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") throw redirect({ to: "/" });
  },
  component: AdminDashboard,
});

export function AdminDashboard() {
  // --- States ---
  const [posts, setPosts] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [shows, setShows] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);

  // Announcement States
  const [announcementText, setAnnouncementText] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);

  // Forms States
  const [newAdminQuestion, setNewAdminQuestion] = useState("");
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [newShow, setNewShow] = useState({
    city: "",
    venue: "",
    event_date: "",
    ticket_url: "",
    maps_url: "",
  });

  // --- Initial Data Fetch ---
  useEffect(() => {
    fetchPosts();
    fetchQuestions();
    fetchShows();
    fetchPolls();
    fetchAnnouncement();
  }, []);

  // --- Fetch Functions ---
  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!posts_user_id_fkey(username)")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  }

  async function fetchQuestions() {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setQuestions(data);
  }

  async function fetchShows() {
    const { data } = await supabase
      .from("shows")
      .select("*")
      .order("event_date", { ascending: true });
    if (data) setShows(data);
  }

  async function fetchPolls() {
    // 1. Φέρνουμε τα polls με τις επιλογές τους
    const { data: pollsData, error: pollsError } = await supabase
      .from("polls")
      .select("*, poll_options(*)")
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Σφάλμα φόρτωσης polls:", pollsError.message);
      return;
    }

    // 2. Φέρνουμε όλες τις ψήφους
    const { data: votesData, error: votesError } = await supabase
      .from("poll_votes")
      .select("*");

    if (votesError) {
      console.error("Σφάλμα φόρτωσης votes:", votesError.message);
    }

    // 3. Συνδέουμε τις ψήφους με κάθε option
    const formattedPolls = pollsData?.map((poll) => ({
      ...poll,
      poll_options: poll.poll_options?.map((opt: any) => ({
        ...opt,
        poll_votes: votesData?.filter((v) => v.option_id === opt.id) || [],
      })),
    }));

    setPolls(formattedPolls || []);
  }

  async function fetchAnnouncement() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();
    if (data) setCurrentAnnouncement(data);
  }

  // --- Announcement Actions ---
  async function handleSaveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!announcementText.trim()) return;

    await supabase.from("announcements").update({ is_active: false }).eq("is_active", true);

    const { error } = await supabase.from("announcements").insert([
      { text: announcementText.trim(), is_active: true }
    ]);

    if (!error) {
      toast.success("Η κορδέλα ανακοίνωσης ενημερώθηκε!");
      setAnnouncementText("");
      fetchAnnouncement();
    } else {
      toast.error("Σφάλμα κατά την αποθήκευση της ανακοίνωσης.");
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (!error) {
      toast.success("Η ανακοίνωση απενεργοποιήθηκε/διαγράφηκε.");
      setCurrentAnnouncement(null);
    }
  }

  // --- Q&A Actions ---
  async function handleCreateQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!newAdminQuestion.trim()) {
      toast.error("Γράψε την ερώτηση που θέλεις να κάνεις στους fans.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("questions").insert([
      {
        user_id: session.user.id,
        question: newAdminQuestion.trim(),
        is_answered: true,
      },
    ]);

    if (!error) {
      toast.success("Η ερώτηση Q&A δημοσιεύτηκε!");
      setNewAdminQuestion("");
      fetchQuestions();
    } else {
      toast.error("Σφάλμα κατά τη δημιουργία ερώτησης.");
    }
  }

  async function handleDeleteQuestion(id: string) {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (!error) {
      toast.success("Η ερώτηση διαγράφηκε.");
      fetchQuestions();
    }
  }

  // --- Post Moderation Actions ---
  async function approvePost(id: string) {
    const { error } = await supabase
      .from("posts")
      .update({ status: "approved" })
      .eq("id", id);
    if (!error) {
      toast.success("Το post εγκρίθηκε!");
      fetchPosts();
    }
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      toast.success("Το post διαγράφηκε.");
      fetchPosts();
    }
  }

  // --- Poll Actions ---
  async function createPoll() {
    if (!newPoll.question.trim()) {
      toast.error("Συμπλήρωσε την ερώτηση του poll.");
      return;
    }
    const validOptions = newPoll.options.filter((o) => o.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("Χρειάζονται τουλάχιστον 2 επιλογές.");
      return;
    }

    const { data: poll, error } = await supabase
      .from("polls")
      .insert([{ question: newPoll.question }])
      .select()
      .single();

    if (poll && !error) {
      const optionsPayload = validOptions.map((label) => ({
        poll_id: poll.id,
        label,
      }));
      await supabase.from("poll_options").insert(optionsPayload);
      toast.success("Η ψηφοφορία δημιουργήθηκε!");
      setNewPoll({ question: "", options: ["", ""] });
      fetchPolls();
    } else {
      toast.error("Σφάλμα κατά τη δημιουργία του Poll.");
    }
  }

  async function handleDeletePoll(id: string) {
    const { error } = await supabase.from("polls").delete().eq("id", id);
    if (!error) {
      toast.success("Το poll διαγράφηκε.");
      fetchPolls();
    }
  }

  // --- Tour / Shows Actions ---
  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    if (!newShow.city || !newShow.venue || !newShow.event_date) {
      toast.error("Συμπλήρωσε Πόλη, Venue και Ημερομηνία.");
      return;
    }

    const { error } = await supabase.from("shows").insert([newShow]);
    if (!error) {
      toast.success("Το show προστέθηκε επιτυχώς!");
      setNewShow({ city: "", venue: "", event_date: "", ticket_url: "", maps_url: "" });
      fetchShows();
    } else {
      toast.error("Σφάλμα κατά την προσθήκη του show.");
    }
  }

  async function toggleSoldOut(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "soldout" ? "tickets" : "soldout";
    const { error } = await supabase
      .from("shows")
      .update({ status: nextStatus })
      .eq("id", id);
    if (!error) {
      toast.success("Ενημερώθηκε η κατάσταση του show.");
      fetchShows();
    }
  }

  async function handleDeleteShow(id: string) {
    const { error } = await supabase.from("shows").delete().eq("id", id);
    if (!error) {
      toast.success("Το show διαγράφηκε.");
      fetchShows();
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="flex flex-col gap-2 border-b border-border/60 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-accent uppercase">Yolte Official Hub</p>
          <h1 className="mt-1 text-4xl font-bold sm:text-6xl">
            Admin <span className="text-violet-chrome">Control Panel</span>
          </h1>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* ==================== 0. HEADLINE ANNOUNCEMENT (MARQUEE) ==================== */}
        <section className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-semibold border-b border-border/60 pb-3">
            <Megaphone className="size-6 text-accent" /> Κυλιόμενη Κορδέλα Ανακοίνωσης (Community Marquee)
          </h2>

          <form onSubmit={handleSaveAnnouncement} className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border/70 bg-card p-6">
            <input
              type="text"
              placeholder="π.χ. ΝΕΟ ALBUM OUT NOW — LIVE ΑΘΗΝΑ 15/10..."
              className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Ενεργοποίηση
            </button>
          </form>

          {currentAnnouncement && (
            <div className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">
              <span><b>Ενεργό Κείμενο:</b> {currentAnnouncement.text}</span>
              <button
                onClick={() => handleDeleteAnnouncement(currentAnnouncement.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Απενεργοποίηση
              </button>
            </div>
          )}
        </section>

        {/* ==================== 1. POLLS MANAGEMENT & RESULTS ==================== */}
        <section className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-semibold border-b border-border/60 pb-3">
            <Vote className="size-6 text-accent" /> Διαχείριση & Αποτελέσματα Ψηφοφοριών (Polls)
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Create New Poll */}
            <div className="space-y-4 rounded-xl border border-border/70 bg-card p-6">
              <h3 className="text-lg font-bold">Δημιουργία Νέου Poll</h3>
              <input
                type="text"
                placeholder="Τίτλος / Ερώτηση..."
                className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              />
              {newPoll.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Επιλογή ${idx + 1}`}
                  className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...newPoll.options];
                    newOpts[idx] = e.target.value;
                    setNewPoll({ ...newPoll, options: newOpts });
                  }}
                />
              ))}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                  className="flex items-center gap-1 text-xs text-accent underline"
                >
                  <Plus className="size-3" /> Προσθήκη επιλογής
                </button>
                <button
                  onClick={createPoll}
                  className="rounded-full bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
                >
                  Δημοσίευση Poll
                </button>
              </div>
            </div>

            {/* Active Polls & Results List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Ενεργά & Παλιά Polls ({polls.length})</h3>
              {polls.length === 0 ? (
                <p className="text-sm text-muted-foreground">Δεν έχει δημιουργηθεί καμία ψηφοφορία.</p>
              ) : (
                polls.map((p) => {
                  const totalVotes = p.poll_options?.reduce(
                    (acc: number, opt: any) => acc + (opt.poll_votes?.length || 0),
                    0
                  ) || 0;

                  return (
                    <div key={p.id} className="rounded-xl border border-border/70 bg-card p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-base">{p.question}</p>
                          <p className="text-xs text-muted-foreground">Σύνολο ψήφων: {totalVotes}</p>
                        </div>
                        <button
                          onClick={() => handleDeletePoll(p.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="size-3.5" /> Διαγραφή
                        </button>
                      </div>

                      {/* Options & Progress Bars */}
                      <div className="space-y-2">
                        {p.poll_options?.map((opt: any) => {
                          const optionVotes = opt.poll_votes?.length || 0;
                          const pct = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

                          return (
                            <div key={opt.id} className="rounded-lg bg-background/50 p-2 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span>{opt.label}</span>
                                <span className="font-bold text-accent">{pct}% ({optionVotes} ψήφοι)</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ==================== 2. Q&A MANAGEMENT ==================== */}
        <section className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-semibold border-b border-border/60 pb-3">
            <HelpCircle className="size-6 text-accent" /> Δημιουργία & Διαχείριση Q&A Topics
          </h2>

          <form onSubmit={handleCreateQuestion} className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border/70 bg-card p-6">
            <input
              type="text"
              placeholder="Γράψε μια νέα ερώτηση για τους fans..."
              className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={newAdminQuestion}
              onChange={(e) => setNewAdminQuestion(e.target.value)}
              required
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Δημοσίευση Ερώτησης
            </button>
          </form>

          <div className="grid gap-4 sm:grid-cols-2">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-wider text-accent uppercase">Q&A Topic</span>
                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                      <CheckCircle2 className="size-3" /> Ενεργό
                    </span>
                  </div>
                  <p className="mt-2 text-base font-bold">{q.question}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(q.created_at).toLocaleDateString("el-GR")}
                  </span>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" /> Διαγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 3. TOUR & SHOWS MANAGEMENT ==================== */}
        <section className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-semibold border-b border-border/60 pb-3">
            <Ticket className="size-6 text-accent" /> Διαχείριση Tour & Shows
          </h2>

          <form onSubmit={handleAddShow} className="grid gap-4 rounded-xl border border-border/70 bg-card p-6 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Πόλη (π.χ. Αθήνα)"
              className="rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={newShow.city}
              onChange={(e) => setNewShow({ ...newShow, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Venue (π.χ. Gagarin 205)"
              className="rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={newShow.venue}
              onChange={(e) => setNewShow({ ...newShow, venue: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              className="rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={newShow.event_date}
              onChange={(e) => setNewShow({ ...newShow, event_date: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Link Εισιτηρίων (Ticket URL)"
              className="rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent"
              value={newShow.ticket_url}
              onChange={(e) => setNewShow({ ...newShow, ticket_url: e.target.value })}
            />
            <input
              type="url"
              placeholder="Google Maps Link (προαιρετικό)"
              className="rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-accent sm:col-span-2"
              value={newShow.maps_url}
              onChange={(e) => setNewShow({ ...newShow, maps_url: e.target.value })}
            />
            <button
              type="submit"
              className="rounded-full bg-accent py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 sm:col-span-2"
            >
              Προσθήκη Live Show
            </button>
          </form>

          <div className="grid gap-4 sm:grid-cols-2">
            {shows.map((s) => (
              <div key={s.id} className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-bold">{s.city}</p>
                      <p className="text-sm text-muted-foreground">{s.venue}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                        s.status === "soldout"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-green-500/20 text-green-400 border border-green-500/40"
                      }`}
                    >
                      {s.status === "soldout" ? "Sold Out" : "Tickets Live"}
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-accent">
                    <Calendar className="size-3.5" />
                    {new Date(s.event_date).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                  <button
                    onClick={() => toggleSoldOut(s.id, s.status)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-accent"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => handleDeleteShow(s.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" /> Διαγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 4. POSTS MANAGEMENT (FAN WALL) ==================== */}
        <section className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-2xl font-semibold border-b border-border/60 pb-3">
            <ShieldAlert className="size-6 text-accent" /> Όλα τα Posts του Fan Wall
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent">@{post.profiles?.username || "Fan"}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      post.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  {post.image_url && (
                    <img src={post.image_url} alt="Post image" className="mt-2 h-32 w-full object-cover rounded-lg" />
                  )}
                  <p className="mt-2 text-sm">{post.text}</p>
                </div>

                <div className="mt-4 flex gap-2 border-t border-border/40 pt-3">
                  {post.status === "pending" && (
                    <button
                      onClick={() => approvePost(post.id)}
                      className="rounded-full bg-green-600 px-3 py-1 text-[10px] font-bold uppercase text-white hover:bg-green-500"
                    >
                      Έγκριση
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase text-white hover:bg-red-500"
                  >
                    Διαγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}