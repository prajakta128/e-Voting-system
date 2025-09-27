import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, Settings, Calendar, Users, Plus, Trash2, Save, User } from "lucide-react";
import type { CreateElectionRequest, Election, GetElectionResponse, LoginResponse } from "@shared/api";

export default function Admin() {
  const lang = (localStorage.getItem("lang") as any) || "en";
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [election, setElection] = useState<Election | null>(null);

  // Admin form state
  const [email, setEmail] = useState("admin@evote.com");
  const [password, setPassword] = useState("Admin@123");
  const [title, setTitle] = useState("Secure E-Voting");
  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");
  const [totalVoters, setTotalVoters] = useState<number>(100);
  const [candidates, setCandidates] = useState<{ name: string; description?: string; logoDataUrl?: string }[]>([]);

  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch("/api/election");
      const data = (await res.json()) as GetElectionResponse;
      setElection(data.election);
    };
    fetchElection();
  }, []);

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = (await res.json()) as LoginResponse;
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      toast({ title: lang === "en" ? "Logged in" : "लॉगिन सफल" });
    } else {
      toast({ title: lang === "en" ? "Invalid credentials" : "गलत क्रेडेंशियल्स", variant: "destructive" });
    }
  };

  const addCandidate = () => setCandidates((c) => [...c, { name: "" }]);
  const updateCandidateName = (i: number, name: string) => setCandidates((cs) => cs.map((c, idx) => (idx === i ? { ...c, name } : c)));
  const removeCandidate = (i: number) => setCandidates((cs) => cs.filter((_, idx) => idx !== i));

  function avatarDataUrl(name: string) {
    const initials = name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const bg = "%236366f1"; // indigo
    const fg = "%23ffffff";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='${bg}' rx='20'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial' font-size='80' fill='${fg}'>${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  async function ensureAuth(): Promise<string | null> {
    let t = token || (localStorage.getItem("adminToken") as string | null);
    if (t) return t;
    // try login with current credentials automatically
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as LoginResponse;
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      return data.token;
    } catch (err) {
      return null;
    }
  }

  const submitElection = async () => {
    const authToken = await ensureAuth();
    if (!authToken) {
      toast({ title: lang === "en" ? "Please login as admin" : "कृपया व्यवस्थापक के रूप में लॉगिन करें", variant: "destructive" });
      return;
    }

    const payload: CreateElectionRequest = {
      title,
      startAt: startAt ? new Date(startAt).getTime() : Date.now(),
      endAt: endAt ? new Date(endAt).getTime() : Date.now() + 60 * 60 * 1000,
      totalVoters,
      candidates: candidates
        .filter((c) => c.name.trim().length > 0)
        .map((c) => ({ name: c.name, description: c.description, logoDataUrl: c.logoDataUrl ?? avatarDataUrl(c.name) })),
    };

    const res = await fetch("/api/election", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast({ title: lang === "en" ? "Election saved" : "चुनाव सहेजा गया" });
      setCandidates([]);
      setTitle("");
      setStartAt("");
      setEndAt("");
      // navigate to voting page
      window.location.href = "/vote";
    } else if (res.status === 401) {
      // session possibly expired, clear and prompt
      localStorage.removeItem("adminToken");
      setToken(null);
      toast({ title: lang === "en" ? "Session expired — please login" : "सत्र समाप्त — कृपया लॉगिन करें", variant: "destructive" });
    } else {
      const err = await res.json().catch(() => ({}));
      toast({ title: err.error || (lang === "en" ? "Failed to save" : "सहेजना विफल"), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-delayed"></div>
      </div>

      <Header />

      <main className="container py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Admin Panel Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {lang === "en" ? "Admin Panel" : "प्रशासन पैनल"}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {lang === "en"
                ? "Login and configure election settings including timeline, voter count, and candidates with descriptions."
                : "लॉगिन करें और चुनाव सेटिंग्स कॉन्फ़िगर करें जिसमें टाइमलाइन, वोटर काउंट और उम्मीदवार शामिल हैं।"
              }
            </p>
          </div>

          {/* Login Card */}
          {!token ? (
            <Card className="bg-white border-gray-200 shadow-sm hover-lift max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-gray-900 text-2xl flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6" />
                  Admin Login
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {lang === "en" ? "Enter your admin credentials to access the panel" : "पैनल तक पहुंचने के लिए अपने एडमिन क्रेडेंशियल दर्ज करें"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium">{lang === "en" ? "Email" : "ईमेल"}</label>
                  <Input
                    type="email"
                    placeholder="admin@evote.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium">{lang === "en" ? "Password" : "पासवर्ड"}</label>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  onClick={login}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-glow hover-lift"
                  size="lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {lang === "en" ? "Login" : "लॉगिन"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Election Configuration Card */
            <Card className="bg-white border-gray-200 shadow-sm hover-lift">
              <CardHeader>
                <CardTitle className="text-gray-900 text-2xl flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  {lang === "en" ? "Election Configuration" : "चुनाव कॉन्फ़िगरेशन"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {lang === "en" ? "Configure your election settings and candidates" : "अपनी चुनाव सेटिंग्स और उम्मीदवारों को कॉन्फ़िगर करें"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Election Settings */}
                <div className="space-y-6">
                  <h3 className="text-gray-900 text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {lang === "en" ? "Election Details" : "चुनाव विवरण"}
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-gray-900 font-medium">{lang === "en" ? "Election Title" : "चुनाव शीर्षक"}</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Secure E-Voting"
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-900 font-medium">{lang === "en" ? "Start Date & Time" : "प्रारंभ दिनांक और समय"}</label>
                      <Input
                        type="datetime-local"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-900 font-medium">{lang === "en" ? "End Date & Time" : "समाप्ति दिनांक और समय"}</label>
                      <Input
                        type="datetime-local"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-900 font-medium">{lang === "en" ? "Total Voters" : "कुल वोटर"}</label>
                      <Input
                        type="number"
                        value={totalVoters}
                        onChange={(e) => setTotalVoters(parseInt(e.target.value || "0"))}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Candidates Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 text-xl font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {lang === "en" ? "Candidates" : "उम्मीदवार"}
                    </h3>
                    <Button
                      variant="secondary"
                      onClick={addCandidate}
                      className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200 hover-lift"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {lang === "en" ? "Add Candidate" : "उम्मीदवार जोड़ें"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {candidates.map((c, idx) => (
                      <Card key={idx} className="bg-gray-50 border-gray-200">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-gray-900 font-medium">{lang === "en" ? "Candidate Name" : "उम्मीदवार का नाम"}</label>
                              <Input
                                placeholder={lang === "en" ? "Enter candidate name" : "उम्मीदवार का नाम दर्ज करें"}
                                value={c.name}
                                onChange={(e) => updateCandidateName(idx, e.target.value)}
                                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-gray-900 font-medium">{lang === "en" ? "Description" : "विवरण"}</label>
                              <textarea
                                value={c.description || ""}
                                onChange={(e) => setCandidates((cs) => cs.map((it, i) => (i === idx ? { ...it, description: e.target.value } : it)))}
                                className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                                placeholder={lang === "en" ? "Candidate description" : "उम्मीदवार विवरण"}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-gray-900 font-medium">{lang === "en" ? "Logo Preview" : "लोगो पूर्वावलोकन"}</label>
                              <div className="flex items-center gap-3">
                                {c.logoDataUrl ? (
                                  <img src={c.logoDataUrl} alt="logo" className="h-12 w-12 rounded-lg object-cover border border-gray-300" />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-500" />
                                  </div>
                                )}
                                <Button
                                  variant="ghost"
                                  onClick={() => removeCandidate(idx)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  {lang === "en" ? "Remove" : "हटाएँ"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={submitElection}
                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-glow hover-lift px-8 py-3"
                    size="lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {lang === "en" ? "Save Election" : "चुनाव सहेजें"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}