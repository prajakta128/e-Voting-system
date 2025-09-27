import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, BarChart3, Clock, CheckCircle } from "lucide-react";

export default function Home() {
  const lang = (localStorage.getItem("lang") as any) || "en";

  const features = [
    {
      icon: Shield,
      title: lang === "en" ? "SHA-256 Hashing" : lang === "hi" ? "SHA-256 हैशिंग" : "SHA-256 हैशिंग",
      description: lang === "en" ? "Voter identities are securely hashed and never stored in plain text" : lang === "hi" ? "मतदाता पहचान सुरक्षित रूप से हैश की जाती है और कभी भी सादे पाठ में संग्रहीत नहीं की जाती" : "मतदाता ओळख सुरक्षितपणे हॅश केली जाते आणि कधीही साद्या मजकुरात संग्रहित केली जात नाही"
    },
    {
      icon: Lock,
      title: lang === "en" ? "AES-256-GCM Encryption" : lang === "hi" ? "AES-256-GCM एन्क्रिप्शन" : "AES-256-GCM एन्क्रिप्शन",
      description: lang === "en" ? "Votes are encrypted with military-grade encryption standards" : lang === "hi" ? "वोट सैन्य-ग्रेड एन्क्रिप्शन मानकों के साथ एन्क्रिप्ट किए जाते हैं" : "मते सैन्य-ग्रेड एन्क्रिप्शन मानकांसह एन्क्रिप्ट केली जातात"
    },
    {
      icon: BarChart3,
      title: lang === "en" ? "Blockchain Ledger" : lang === "hi" ? "ब्लॉकचेन लेज़र" : "ब्लॉकचेन लेजर",
      description: lang === "en" ? "Append-only ledger ensures tamper-evident audit trails" : lang === "hi" ? "Append-only लेज़र छेड़छाड-साक्ष्य ऑडिट ट्रेल्स सुनिश्चित करता है" : "Append-only लेजर छेडछाड-पुरावा ऑडिट ट्रेल्स सुनिश्चित करते"
    }
  ];

  const steps = [
    {
      icon: Users,
      title: lang === "en" ? "Admin Setup" : lang === "hi" ? "एडमिन सेटअप" : "एडमिन सेटअप",
      description: lang === "en" ? "Create election with timeline, candidates, and voter count" : lang === "hi" ? "टाइमलाइन, उम्मीदवार और मतदाता गिनती के साथ चुनाव बनाएं" : "टाइमलाइन, उम्मीदवार आणि मतदाता गिनतीसह निवडणूक तयार करा"
    },
    {
      icon: Shield,
      title: lang === "en" ? "Voter Verification" : lang === "hi" ? "मतदाता सत्यापन" : "मतदाता सत्यापन",
      description: lang === "en" ? "Upload ID document and get hashed voter ID" : lang === "hi" ? "आईडी दस्तावेज़ अपलोड करें और हैश्ड मतदाता आईडी प्राप्त करें" : "आयडी दस्तावेज अपलोड करा आणि हॅश केलेली मतदाता आयडी मिळवा"
    },
    {
      icon: CheckCircle,
      title: lang === "en" ? "Cast Vote" : lang === "hi" ? "वोट डालें" : "मतदान करा",
      description: lang === "en" ? "Select candidate and submit encrypted vote" : lang === "hi" ? "उम्मीदवार चुनें और एन्क्रिप्टेड वोट सबमिट करें" : "उम्मीदवार निवडा आणि एन्क्रिप्ट केलेले मत सबमिट करा"
    },
    {
      icon: BarChart3,
      title: lang === "en" ? "View Results" : lang === "hi" ? "परिणाम देखें" : "परिणाम पहा",
      description: lang === "en" ? "Results available after election ends with audit trail" : lang === "hi" ? "चुनाव समाप्त होने के बाद ऑडिट ट्रेल के साथ परिणाम उपलब्ध" : "निवडणूक संपल्यानंतर ऑडिट ट्रेलसह परिणाम उपलब्ध"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pulse-glow"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white border-blue-600">
                <Shield className="w-4 h-4 mr-2" />
                {lang === "en" ? "Secure E-Voting Platform" : lang === "hi" ? "सुरक्षित ई-वोटिंग प्लेटफॉर्म" : "सुरक्षित ई-वोटिंग प्लॅटफॉर्म"}
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  eVote
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {lang === "en"
                  ? "A privacy-first, secure e-voting system using SHA-256 hashing, AES-256-GCM encryption, and blockchain-like ledger for complete transparency and auditability."
                  : lang === "hi"
                    ? "SHA-256 हैशिंग, AES-256-GCM एन्क्रिप्शन और ब्लॉकचेन जैसी लेज़र के साथ पूर्ण पारदर्शिता और ऑडिट क्षमता के लिए एक प्राइवेसी-फर्स्ट, सुरक्षित ई-वोटिंग सिस्टम।"
                    : "SHA-256 हैशिंग, AES-256-GCM एन्क्रिप्शन आणि ब्लॉकचेनसारखा लेजर वापरून पूर्ण पारदर्शिता आणि ऑडिट क्षमतेसाठी एक प्रायव्हसी-फर्स्ट, सुरक्षित ई-वोटिंग सिस्टम."
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-800 shadow-glow hover-lift">
                <a href="/admin">
                  <Users className="w-5 h-5 mr-2" />
                  {lang === "en" ? "Admin Panel" : lang === "hi" ? "एडमिन पैनल" : "एडमिन पॅनेल"}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white hover-lift">
                <a href="/vote">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {lang === "en" ? "Start Voting" : lang === "hi" ? "वोटिंग शुरू करें" : "मतदान सुरू करा"}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {lang === "en" ? "Security Features" : lang === "hi" ? "सुरक्षा सुविधाएं" : "सुरक्षा सुविधा"}
              </h2>
              <p className="text-gray-600 text-lg">
                {lang === "en" ? "Built with enterprise-grade security standards" : lang === "hi" ? "एंटरप्राइज़-ग्रेड सुरक्षा मानकों के साथ निर्मित" : "एंटरप्राइज़-ग्रेड सुरक्षा मानकांसह तयार केले"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white hover-lift border-gray-200 shadow-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {lang === "en" ? "How It Works" : lang === "hi" ? "यह कैसे काम करता है" : "हे कसे काम करते"}
              </h2>
              <p className="text-gray-600 text-lg">
                {lang === "en" ? "Simple steps to secure voting" : lang === "hi" ? "सुरक्षित वोटिंग के लिए सरल चरण" : "सुरक्षित मतदानासाठी सोपे चरण"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="bg-white hover-lift border-gray-200 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardHeader className="pt-6">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-gray-900 text-center">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Language Support */}
        <section className="container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="py-6">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">
                    {lang === "en" ? "Languages: Marathi, English, Hindi — use the language switcher in the header." : lang === "hi" ? "भाषाएं: मराठी, अंग्रेजी, हिंदी — हेडर में भाषा स्विचर का उपयोग करें।" : "भाषा: मराठी, इंग्रजी, हिंदी — हेडरमध्ये भाषा स्विचर वापरा."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
