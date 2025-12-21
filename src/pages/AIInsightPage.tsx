import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAlumni } from '@/contexts/AlumniContext';
import { Sparkles, TrendingUp, Users, MapPin, Building2, Briefcase, Rocket, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIInsightPage() {
  const { alumniData, masterData } = useAlumni();
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const generateInsights = () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const bekerja = alumniData.filter(d => d.status === 'bekerja');
      const wirausaha = alumniData.filter(d => d.status === 'wirausaha');
      const studi = alumniData.filter(d => d.status === 'studi');
      const mencari = alumniData.filter(d => d.status === 'mencari');

      // Calculate percentages
      const total = alumniData.length;
      const bekerjaPercent = total ? Math.round((bekerja.length / total) * 100) : 0;
      const wirausahaPercent = total ? Math.round((wirausaha.length / total) * 100) : 0;

      // Industry analysis
      const industryCount: Record<string, number> = {};
      bekerja.forEach(d => {
        if (d.bidangIndustri) {
          industryCount[d.bidangIndustri] = (industryCount[d.bidangIndustri] || 0) + 1;
        }
      });
      const topIndustry = Object.entries(industryCount).sort((a, b) => b[1] - a[1])[0];

      // Location analysis
      const locationCount: Record<string, number> = {};
      bekerja.forEach(d => {
        if (d.lokasiPerusahaan) {
          locationCount[d.lokasiPerusahaan] = (locationCount[d.lokasiPerusahaan] || 0) + 1;
        }
      });
      const topLocation = Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0];

      // Jurusan analysis
      const jurusanBekerja: Record<string, number> = {};
      bekerja.forEach(d => {
        const master = masterData.find(m => m.id === d.alumniMasterId);
        if (master) {
          jurusanBekerja[master.jurusan] = (jurusanBekerja[master.jurusan] || 0) + 1;
        }
      });
      const topJurusan = Object.entries(jurusanBekerja).sort((a, b) => b[1] - a[1])[0];

      const generatedInsights = [
        `📊 **Tingkat Keterserapan Kerja**: ${bekerjaPercent}% alumni saat ini berstatus bekerja, menunjukkan tingkat employability yang ${bekerjaPercent >= 70 ? 'sangat baik' : bekerjaPercent >= 50 ? 'cukup baik' : 'perlu ditingkatkan'}.`,
        `🚀 **Tren Kewirausahaan**: ${wirausahaPercent}% alumni memilih jalur wirausaha. ${wirausahaPercent >= 20 ? 'Ini menunjukkan jiwa entrepreneurship yang tinggi di kalangan alumni Polines.' : 'Kampus dapat mempertimbangkan program inkubasi bisnis untuk mendorong lebih banyak wirausaha.'}`,
        topIndustry ? `🏭 **Industri Dominan**: Sektor ${topIndustry[0]} menjadi pilihan terbanyak dengan ${topIndustry[1]} alumni, menunjukkan kesesuaian kurikulum dengan kebutuhan industri tersebut.` : '',
        topLocation ? `📍 **Persebaran Lokasi Kerja**: ${topLocation[0]} menjadi lokasi kerja terfavorit dengan ${topLocation[1]} alumni. Hal ini dapat menjadi acuan untuk program kerjasama industri.` : '',
        topJurusan ? `🎓 **Jurusan Unggulan**: Alumni dari jurusan ${topJurusan[0]} menunjukkan tingkat keterserapan kerja tertinggi dengan ${topJurusan[1]} alumni bekerja.` : '',
        studi.length > 0 ? `📚 **Minat Studi Lanjut**: ${studi.length} alumni melanjutkan pendidikan ke jenjang yang lebih tinggi, menunjukkan komitmen untuk pengembangan akademik.` : '',
        mencari.length > 0 ? `🔍 **Alumni Mencari Kerja**: Terdapat ${mencari.length} alumni yang sedang aktif mencari pekerjaan. Kampus dapat membantu dengan program job fair atau career counseling.` : '',
        `💡 **Rekomendasi**: Berdasarkan analisis data, disarankan untuk memperkuat kerjasama dengan industri ${topIndustry?.[0] || 'unggulan'} dan mengembangkan program magang yang lebih intensif.`,
      ].filter(Boolean);

      setInsights(generatedInsights);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">AI Insight</h1>
                  <p className="text-muted-foreground">Analisis cerdas data alumni menggunakan AI.</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{alumniData.length}</p>
                <p className="text-xs text-muted-foreground">Data Dianalisis</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{alumniData.filter(d => d.status === 'bekerja').length}</p>
                <p className="text-xs text-muted-foreground">Bekerja</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Rocket className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{alumniData.filter(d => d.status === 'wirausaha').length}</p>
                <p className="text-xs text-muted-foreground">Wirausaha</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-info mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {alumniData.length ? Math.round((alumniData.filter(d => d.status === 'bekerja').length / alumniData.length) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Tingkat Kerja</p>
              </div>
            </div>

            {/* Generate Button */}
            {insights.length === 0 && (
              <div className="glass-card rounded-2xl p-8 text-center mb-8">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Siap Menganalisis Data Alumni</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  AI akan menganalisis seluruh data alumni dan memberikan insight yang berguna untuk pengambilan keputusan.
                </p>
                <Button onClick={generateInsights} disabled={isGenerating} size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Menganalisis Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Insight
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Hasil Analisis AI</h2>
                  <Button variant="outline" onClick={generateInsights} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-2">Regenerate</span>
                  </Button>
                </div>

                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="glass-card rounded-xl p-5 animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="prose prose-sm max-w-none text-foreground">
                      {insight.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </div>
                  </div>
                ))}

                <div className="glass-card rounded-xl p-5 bg-primary/5 border-primary/20 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Catatan AI</p>
                      <p className="text-sm text-muted-foreground">
                        Analisis ini dihasilkan berdasarkan data yang tersedia saat ini. 
                        Untuk hasil yang lebih akurat, pastikan lebih banyak alumni telah mengisi form status mereka.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
