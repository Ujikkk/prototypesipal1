import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Siapa saja yang bisa mengisi data di SIPAL?',
    answer: 'SIPAL hanya dapat diakses oleh alumni Politeknik Negeri Semarang yang terverifikasi. Sistem akan mencocokkan data Anda dengan database master alumni sebelum mengizinkan pengisian form.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, keamanan data adalah prioritas kami. Seluruh data disimpan dengan enkripsi dan hanya dapat diakses oleh admin yang berwenang untuk keperluan analisis statistik.',
  },
  {
    question: 'Bagaimana jika nama saya tidak ditemukan di sistem?',
    answer: 'Jika nama Anda tidak ditemukan, silakan gunakan tombol "Laporkan ke Admin" untuk melaporkan masalah ini. Tim kami akan memverifikasi dan menambahkan data Anda ke sistem.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk mengisi form?',
    answer: 'Pengisian form hanya membutuhkan waktu sekitar 3-5 menit. Form dirancang sederhana dan intuitif untuk kenyamanan alumni.',
  },
  {
    question: 'Apakah saya bisa mengupdate data di kemudian hari?',
    answer: 'Tentu! Anda dapat mengupdate data status karir Anda kapan saja. Sistem akan menyimpan riwayat perubahan untuk tracking perkembangan karir.',
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-lg text-muted-foreground">
              Temukan jawaban untuk pertanyaan yang sering diajukan.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border rounded-xl px-6 data-[state=open]:shadow-soft transition-shadow"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
