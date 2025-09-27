import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";
import { useNavigate } from "react-router-dom";
import { Upload, User, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { GetElectionResponse } from "@shared/api";

export default function Vote() {
  const [docUploaded, setDocUploaded] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [electionAvailable, setElectionAvailable] = useState(false);
  const [election, setElection] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch("/api/election");
      const data = (await res.json()) as GetElectionResponse;
      if (data.election) {
        setElection(data.election);
        const now = Date.now();
        setElectionAvailable(now >= data.election.startAt && now <= data.election.endAt);
      }
    };
    fetchElection();
  }, []);

  const verify = async () => {
    if (!docUploaded || !voterId) return;
    setIsVerifying(true);

    try {
      const h = await sha256(voterId.trim());
      sessionStorage.setItem("voterHash", h);
      navigate(`/cast?voterHash=${h}`);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Election Status Card */}
          {election && (
            <Card className="bg-white border-gray-200 shadow-sm hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 text-xl">{election.title}</CardTitle>
                  <Badge
                    variant={electionAvailable ? "default" : "secondary"}
                    className={electionAvailable ? "bg-green-500/20 text-green-100 border-green-400/30" : "bg-red-500/20 text-red-100 border-red-400/30"}
                  >
                    {electionAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription className="text-white/80">
                  {electionAvailable
                    ? "Voting is currently active. You can proceed with verification."
                    : "Voting is not currently active. Please check back later."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Start: {formatDate(election.startAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>End: {formatDate(election.endAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Card */}
          <Card className="bg-white border-gray-200 shadow-sm hover-lift">
            <CardHeader>
              <CardTitle className="text-gray-900 text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Voter Verification
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Upload your ID document and enter your voter ID to verify your identity. After verification, you will proceed to cast your vote.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Upload */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-900 font-medium">
                  <Upload className="w-5 h-5" />
                  Upload ID Document
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    onChange={() => setDocUploaded(true)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {docUploaded && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  Supported formats: PDF, JPG, JPEG, PNG
                </p>
              </div>

              {/* Voter ID Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-900 font-medium">
                  <User className="w-5 h-5" />
                  Voter ID
                </label>
                <Input
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder="Enter your voter ID"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
                />
                <p className="text-gray-600 text-sm">
                  Your voter ID will be securely hashed using SHA-256
                </p>
              </div>

              {/* Verification Button */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={verify}
                  disabled={!docUploaded || !voterId || !electionAvailable || isVerifying}
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-glow hover-lift flex-1"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </div>

              {/* Status Messages */}
              {!electionAvailable && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-100 text-sm">Voting is not currently active</span>
                </div>
              )}

              {docUploaded && voterId && electionAvailable && (
                <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-100 text-sm">Ready to verify and proceed to voting</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-gray-600 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-gray-900 font-medium">Security Notice</h3>
                  <p className="text-gray-600 text-sm">
                    Your voter ID will be hashed using SHA-256 and never stored in plain text.
                    Your uploaded document is used for verification purposes only and is not permanently stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
