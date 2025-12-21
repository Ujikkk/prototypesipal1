import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap,
  Lightbulb,
  RefreshCw,
  MapPin,
  Briefcase,
  Rocket,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAlumniStore } from '@/stores/alumniStore';
import { Progress } from '@/components/ui/progress';

export default function AIInsightsPage() {
  const { submissions, masterData } = useAlumniStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  // Calculate insights
  const insights = useMemo(() => {
    const totalAlumni = masterData.length;
    const withSubmissions = submissions.length;
    const responseRate = (withSubmissions / totalAlumni * 100).toFixed(1);

    // Status distribution
    const statusCount = {
      working: submissions.filter(s => s.status === 'working').length,
      entrepreneur: submissions.filter(s => s.status === 'entrepreneur').length,
      studying: submissions.filter(s => s.status === 'studying').length,
      searching: submissions.filter(s => s.status === 'searching').length,
    };

    const employmentRate = ((statusCount.working + statusCount.entrepreneur) / withSubmissions * 100).toFixed(1);

    // Industry analysis
    const industryCount: Record<string, number> = {};
    submissions.forEach(sub => {
      if (sub.status === 'working' && sub.workingData) {
        const industry = sub.workingData.bidangIndustri;
        industryCount[industry] = (industryCount[industry] || 0) + 1;
      }
    });
    const topIndustry = Object.entries(industryCount).sort((a, b) => b[1] - a[1])[0];

    // Location analysis
    const locationCount: Record<string, number> = {};
    submissions.forEach(sub => {
      let location = '';
      if (sub.status === 'working' && sub.workingData) {
        location = sub.workingData.lokasiPerusahaan;
      } else if (sub.status === 'entrepreneur' && sub.entrepreneurData) {
        location = sub.entrepreneurData.lokasiUsaha;
      }
      if (location) {
        locationCount[location] = (locationCount[location] || 0) + 1;
      }
    });
    const topLocations = Object.entries(locationCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

    // Year analysis
    const yearStats: Record<number, { total: number; working: number; entrepreneur: number }> = {};
    masterData.forEach(alumni => {
      const year = alumni.tahunLulus;
      if (!yearStats[year]) {
        yearStats[year] = { total: 0, working: 0, entrepreneur: 0 };
      }
      yearStats[year].total++;
    });
    submissions.forEach(sub => {
      const alumni = masterData.find(a => a.id === sub.alumniId);
      if (alumni) {
        if (sub.status === 'working') yearStats[alumni.tahunLulus].working++;
        if (sub.status === 'entrepreneur') yearStats[alumni.tahunLulus].entrepreneur++;
      }
    });

    // Prodi analysis
    const prodiStats: Record<string, { total: number; working: number }> = {};
    masterData.forEach(alumni => {
      if (!prodiStats[alumni.prodi]) {
        prodiStats[alumni.prodi] = { total: 0, working: 0 };
      }
      prodiStats[alumni.prodi].total++;
    });
    submissions.forEach(sub => {
      const alumni = masterData.find(a => a.id === sub.alumniId);
      if (alumni && sub.status === 'working') {
        prodiStats[alumni.prodi].working++;
      }
    });
    const topProdi = Object.entries(prodiStats)
      .map(([prodi, data]) => ({ prodi, rate: data.working / data.total * 100 }))
      .filter(p => prodiStats[p.prodi].total >= 2)
      .sort((a, b) => b.rate - a.rate)[0];

    // Entrepreneur analysis
    const entrepreneurRate = (statusCount.entrepreneur / withSubmissions * 100).toFixed(1);
    const activeEntrepreneurs = submissions.filter(
      s => s.status === 'entrepreneur' && s.entrepreneurData?.usahaAktif
    ).length;

    return {
      totalAlumni,
      withSubmissions,
      responseRate,
      employmentRate,
      statusCount,
      topIndustry,
      topLocations,
      yearStats,
      topProdi,
      entrepreneurRate,
      activeEntrepreneurs,
    };
  }, [submissions, masterData]);

  const handleRefresh = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  // AI Generated Narratives
  const narratives = useMemo(() => [
    {
      icon: TrendingUp,
      title: 'Tingkat Keterserapan Kerja',
      content: `${insights.employmentRate}% alumni yang mengisi data sudah bekerja atau berwirausaha. Ini menunjukkan tingkat keterserapan yang ${Number(insights.employmentRate) > 80 ? 'sangat baik' : Number(insights.employmentRate) > 60 ? 'cukup baik' : 'perlu perhatian'}.`,
      highlight: `${insights.employmentRate}%`,
      color: 'text-accent',
    },
    {
      icon: Building2,
      title: 'Industri Terpopuler',
      content: insights.topIndustry 
        ? `Sektor ${insights.topIndustry[0]} menjadi pilihan utama dengan ${insights.topIndustry[1]} alumni (${(insights.topIndustry[1] / insights.statusCount.working * 100).toFixed(0)}% dari yang bekerja).`
        : 'Belum ada data industri yang cukup.',
      highlight: insights.topIndustry?.[0] || '-',
      color: 'text-success',
    },
    {
      icon: MapPin,
      title: 'Persebaran Lokasi Kerja',
      content: insights.topLocations.length > 0
        ? `${insights.topLocations.map(l => l[0]).join(', ')} menjadi lokasi kerja terbanyak. ${insights.topLocations[0]?.[0] || ''} memimpin dengan ${insights.topLocations[0]?.[1] || 0} alumni.`
        : 'Belum ada data lokasi yang cukup.',
      highlight: insights.topLocations[0]?.[0] || '-',
      color: 'text-info',
    },
    {
      icon: GraduationCap,
      title: 'Prodi dengan Tingkat Kerja Tertinggi',
      content: insights.topProdi
        ? `Alumni ${insights.topProdi.prodi} memiliki tingkat kerja tertinggi yaitu ${insights.topProdi.rate.toFixed(0)}%. Program studi ini patut menjadi benchmark.`
        : 'Belum ada data prodi yang cukup.',
      highlight: insights.topProdi?.prodi || '-',
      color: 'text-warning',
    },
    {
      icon: Rocket,
      title: 'Tren Kewirausahaan',
      content: `${insights.entrepreneurRate}% alumni memilih jalur wirausaha dengan ${insights.activeEntrepreneurs} usaha yang masih aktif. ${Number(insights.entrepreneurRate) > 15 ? 'Semangat entrepreneurship cukup tinggi!' : 'Ada potensi untuk meningkatkan program kewirausahaan.'}`,
      highlight: `${insights.entrepreneurRate}%`,
      color: 'text-success',
    },
    {
      icon: Users,
      title: 'Response Rate Survey',
      content: `Dari ${insights.totalAlumni} total alumni dalam database, ${insights.withSubmissions} orang (${insights.responseRate}%) sudah mengisi data. ${Number(insights.responseRate) > 50 ? 'Partisipasi sangat baik!' : 'Perlu upaya untuk meningkatkan partisipasi alumni.'}`,
      highlight: `${insights.responseRate}%`,
      color: 'text-primary',
    },
  ], [insights]);

  // Recommendations
  const recommendations = useMemo(() => [
    insights.statusCount.searching > 0 && {
      title: 'Job Fair untuk Alumni',
      description: `Terdapat ${insights.statusCount.searching} alumni yang sedang mencari kerja. Pertimbangkan untuk mengadakan job fair atau career matching program.`,
    },
    Number(insights.responseRate) < 50 && {
      title: 'Tingkatkan Partisipasi',
      description: 'Response rate masih di bawah 50%. Lakukan reminder melalui email atau WhatsApp untuk meningkatkan pengisian data.',
    },
    insights.topIndustry && {
      title: 'Kerjasama Industri',
      description: `Perkuat kerjasama dengan perusahaan di sektor ${insights.topIndustry[0]} karena menjadi tujuan utama alumni.`,
    },
    Number(insights.entrepreneurRate) > 10 && {
      title: 'Program Inkubasi Bisnis',
      description: 'Tingkat wirausaha cukup tinggi. Pertimbangkan program inkubasi atau mentoring untuk mendukung alumni entrepreneur.',
    },
  ].filter(Boolean), [insights]);

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-accent" />
                AI Insights
              </h1>
              <p className="text-muted-foreground">
                Analisis otomatis berbasis AI untuk data alumni.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Menganalisis...' : 'Refresh'}
            </Button>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card variant="glass" className="mb-8 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">AI sedang menganalisis data...</p>
                    <p className="text-sm text-muted-foreground">Memproses {insights.withSubmissions} submission dari {insights.totalAlumni} alumni</p>
                  </div>
                </div>
                <Progress value={isAnalyzing ? 60 : 100} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="elevated">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gradient">{insights.employmentRate}%</p>
                <p className="text-sm text-muted-foreground">Tingkat Kerja</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gradient">{insights.responseRate}%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gradient">{insights.statusCount.working}</p>
                <p className="text-sm text-muted-foreground">Alumni Bekerja</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-gradient">{insights.statusCount.entrepreneur}</p>
                <p className="text-sm text-muted-foreground">Wirausaha</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Narratives */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Analisis Otomatis
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {narratives.map((narrative, index) => (
                <Card 
                  key={index} 
                  variant="interactive"
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                        <narrative.icon className={`h-5 w-5 ${narrative.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm">
                            {narrative.title}
                          </h3>
                          <span className={`text-lg font-bold ${narrative.color}`}>
                            {narrative.highlight}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {narrative.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Rekomendasi AI
              </h2>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <Card 
                    key={index} 
                    variant="glass"
                    className="border-l-4 border-l-warning animate-fade-in"
                    style={{ animationDelay: `${(narratives.length + index) * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">
                        {rec?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {rec?.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <Card variant="flat" className="mt-8">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 inline-block mr-1 text-accent" />
                Insights ini dihasilkan secara otomatis berdasarkan data yang tersedia. 
                Analisis akan semakin akurat seiring bertambahnya data alumni.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
