"use client";

import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContexts";
import AOS from "aos";
import "aos/dist/aos.css";

const BENEFITS = [
  {
    icon: "bi-shield-check",
    title: "Terpercaya",
    desc: "Data & layanan 100% terjamin aman sesuai standar kesehatan nasional.",
    color: "success",
  },
  {
    icon: "bi-lightning-charge",
    title: "Cepat & Mudah",
    desc: "Proses pendaftaran, booking, dan akses riwayat hanya perlu beberapa klik.",
    color: "info",
  },
  {
    icon: "bi-cpu",
    title: "Teknologi Modern",
    desc: "Integrasi sistem digital terkini demi kemudahan seluruh keluarga.",
    color: "primary",
  },
];

const SERVICES = [
  {
    icon: "bi-people",
    title: "Manajemen Pasien",
    text: "Pendaftaran dan pelacakan riwayat medis lengkap, mudah diakses.",
  },
  {
    icon: "bi-calendar-check",
    title: "Booking Janji Temu",
    text: "Penjadwalan janji temu online yang fleksibel dengan dokter pilihan.",
  },
  {
    icon: "bi-capsule",
    title: "Manajemen Obat",
    text: "Integrasi apotek digital dengan pelacakan resep yang efisien.",
  },
  {
    icon: "bi-shield-lock",
    title: "Rekam Medis Aman",
    text: "Penyimpanan rekam medis terenkripsi sesuai standar privasi.",
  },
  {
    icon: "bi-clock-history",
    title: "Dukungan 24/7",
    text: "Layanan medis non-stop dan respons cepat keadaan darurat.",
  },
  {
    icon: "bi-hospital",
    title: "Fasilitas Modern",
    text: "Tim medis profesional dan fasilitas canggih siap melayani Anda.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ridho Martadinata",
    role: "Pasien",
    text: "Booking konsultasi sangat mudah, dan hasil lab langsung bisa dilihat. Sukses terus MediCare!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Dewi Astuti",
    role: "Ibu Rumah Tangga",
    text: "Anak saya lebih mudah dipantau kesehatannya lewat MediCare. Data imunisasi juga terintegrasi.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "dr. Ronald",
    role: "Dokter",
    text: "Sistem rekam medis cepat & akurat, tim IT MediCare selalu siap membantu.",
    img: "https://randomuser.me/api/portraits/men/13.jpg",
  },
];

const HomePage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const heroBgClass = theme === "dark" ? "bg-dark-elegant" : "bg-light-hero";
  const sectionBgClass = theme === "dark" ? "bg-dark-section" : "bg-light-section";
  const textColorClass = theme === "dark" ? "text-white" : "text-dark";
  const mutedTextColorClass = theme === "dark" ? "text-muted-dark" : "text-muted-light";

  return (
    <>
      {/* ----------------------------------- HERO SECTION ----------------------------------- */}
      <section className={`position-relative ${heroBgClass} ${textColorClass} pb-0`}>
        <Container className="pt-5 pt-lg-6 z-2 position-relative" data-aos="fade-up">
          <Row className="align-items-center">
            <Col md={6} className="mb-5 mb-md-0 text-md-start text-center">
              <div className="d-none d-lg-block mb-2">
                <span className="badge rounded-pill bg-info-subtle text-info px-3 py-2 fs-6 fw-bold shadow-sm">
                  <i className="bi bi-star-fill me-1"></i> Perawatan Kesehatan Modern
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3">
                Selamat Datang di <span className="text-info">MediCare</span>
              </h1>
              <p className={`lead mb-4 ${mutedTextColorClass}`}>
                Solusi kesehatan digital keluarga Indonesia. Satu WebSite untuk booking, cek hasil lab, jadwal imunisasi, beli obat, bahkan konsultasi online kapan saja!  
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  as={Link}
                  to="/masuk"
                  variant="info"
                  size="lg"
                  className={`rounded-pill px-5 py-2 fw-bold ${theme === 'dark' ? 'text-dark' : 'text-white'} shadow-sm`}
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  Masuk Pasien
                </Button>
                <Button
                  as={Link}
                  to="/daftar"
                  variant={theme === "dark" ? "outline-light" : "outline-secondary"}
                  size="lg"
                  className={`rounded-pill px-5 py-2 fw-bold ${theme === 'dark' ? 'text-light border-light' : 'text-dark'} shadow-sm`}
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  Daftar Akun
                </Button>
              </div>
              <ul className="list-unstyled mb-0 small px-2">
                <li className="mb-1"><i className="bi bi-check-circle text-info me-2"></i>Data Anda 100% aman & terenskripsi</li>
                <li className="mb-1"><i className="bi bi-check-circle text-info me-2"></i>Support Telekonsultasi & Resep Digital</li>
                <li><i className="bi bi-check-circle text-info me-2"></i>Tersedia untuk semua usia</li>
              </ul>
            </Col>
            <Col md={6} className="text-center">
              <img
                src="src/assets/dokter11.png"
                alt="Ilustrasi Dokter Online"
                className="img-fluid floating-hero"
                style={{ maxHeight: 330 }}
                data-aos="fade-left"
                data-aos-delay="190"
              />
            </Col>
          </Row>
        </Container>
        {/* SVG Wave Divider */}
        <div className="custom-shape-divider-bottom-168 bg-body w-100" style={{marginTop:'-7rem', zIndex: 1, position:'relative'}}>
          <svg viewBox="0 0 1200 108" preserveAspectRatio="none" style={{width:'100%',height:90,display:'block'}}>
            <path d="M1200 0L0 0 0 27.47c184.4 40.3 364.7 57.8 544 49.8 217.6-9.7 435-61.3 656-25.9V0z" fill="#e6f5fb" opacity="0.67"></path>
            <path d="M0 0v10.13c54.52 7.2 109.06 13.85 163.63 20.29C325.76 45 493.7 63.77 661.47 50.71c97.7-7.61 193.64-27.73 290.35-37.88C1052.5 6.9 1126.3 5.33 1200 7.64V0z" fill="#e0f7fa"></path>
          </svg>
        </div>
      </section>

      {/* ----------------------------------- BENEFIT/KEUNGGULAN QUICK ----------------------------------- */}
      <section className={`py-2 ${sectionBgClass}`}>
        <Container>
          <Row className="justify-content-center text-center">
            {BENEFITS.map((b, i) => (
              <Col sm={4} xs={12} key={i} className="mb-2" data-aos="fade-up" data-aos-delay={i * 110}>
                <div className={`p-3 rounded-4 shadow-sm d-inline-flex flex-column align-items-center benefit-card bg-${b.color}-subtle`}>
                  <span className={`mb-2 fs-2 text-${b.color}`}>
                    <i className={`bi ${b.icon}`}></i>
                  </span>
                  <span className="fw-bold mb-1">{b.title}</span>
                  <small className={mutedTextColorClass}>{b.desc}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ----------------------------------- SERVICES/LAYANAN ----------------------------------- */}
      <section className={`py-5 pb-4 ${sectionBgClass} ${textColorClass}`} id="layanan">
        <Container>
          <h2 className="text-center mb-5 fw-bold" data-aos="fade-up">
            Layanan Unggulan Kami
          </h2>
          <Row className="g-4 justify-content-center">
            {SERVICES.map((service, index) => (
              <Col md={6} lg={4} key={index}
                   data-aos="fade-up"
                   data-aos-delay={80 + index * 110}
              >
                <Card
                  className={`h-100 border-0 service-card shadow-lg rounded-4 ${theme === "dark" ? "bg-card-dark text-muted-dark" : "bg-white text-dark"}`}
                >
                  <Card.Body className="text-center p-4">
                    <i className={`${service.icon} display-5 mb-3 service-icon text-info icon-service`}></i>
                    <Card.Title className="h5 mb-2 fw-bold">{service.title}</Card.Title>
                    <Card.Text className={mutedTextColorClass}>{service.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ----------------------------------- TESTIMONIAL SECTION ----------------------------------- */}
      <section className={`pt-6 pb-5 bg-gradient-review ${textColorClass}`}>
        <Container>
          <h2 className="text-center mb-5 fw-bold" data-aos="fade-up">Kesan Pasien & Dokter</h2>
          <Row className="justify-content-center g-4">
            {TESTIMONIALS.map((t, idx) => (
              <Col md={4} key={idx} data-aos="fade-up" data-aos-delay={idx * 150}>
                <Card className="testimonial-card shadow border-0 rounded-4 h-100 p-3">
                  <div className="text-center mb-3">
                    <img src={t.img} alt="" style={{ width: 68, height: 68 }} className="rounded-circle border border-info border-2 mb-2 shadow-sm" />
                    <h6 className="fw-bold mb-0 mt-2">{t.name}</h6>
                    <div className="text-info small mb-1">{t.role}</div>
                  </div>
                  <Card.Text className="fst-italic text-center">
                    <span className="text-secondary fs-4 me-1">“</span>
                    {t.text}
                    <span className="text-secondary fs-4 ms-1">”</span>
                  </Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ----------------------------------- CTA SECTION ----------------------------------- */}
      <section className={`py-5 py-lg-6 mt-6 ${heroBgClass} ${textColorClass} text-center`}>
        <Container className="my-4" data-aos="zoom-in-up">
          <h2 className="mb-4 fw-bold">Mulai Petualangan Kesehatan Anda Bersama MediCare</h2>
          <p className={`lead mb-5 mx-auto ${mutedTextColorClass}`} style={{ maxWidth: '700px' }}>
            Bergabunglah dengan komunitas MediCare yang terus berkembang. Nikmati kemudahan akses layanan kesehatan kapan saja, di mana saja bersama tim dokter dan perawat terbaik kami.
          </p>
          <Button
            as={Link}
            to="/daftar"
            variant={theme === 'dark' ? 'info' : 'primary'}
            size="lg"
            className={`rounded-pill px-5 py-3 fw-bold ${theme === 'dark' ? 'text-dark' : 'text-white'} shadow-lg`}
          >
            Daftar Sekarang
          </Button>
        </Container>
      </section>

      {/* --------- Animasi & Custom Style --------- */}
      <style>{`
        .floating-hero {
          animation: floatingY 3.3s ease-in-out infinite alternate;
        }
        @keyframes floatingY {
          0% { transform: translateY(0);}
          100% { transform: translateY(-22px);}
        }
        .custom-shape-divider-bottom-168 {
          position: absolute;
          left: 0; right: 0;
          bottom: -25px; /* or adjust for overlap */
        }
        .bg-light-hero { background: linear-gradient(120deg,#e0f7fa 30%,#fafdff 100%);}
        .bg-dark-elegant { background: linear-gradient(125deg, #071011 30%, #22344c 100%);}
        .bg-light-section { background: #fafdff;}
        .bg-dark-section { background: #15223a;}
        .text-muted-light { color: #8594a5 !important; }
        .text-muted-dark { color: #a6bacd !important; }
        .service-card {
          transition: box-shadow .20s, transform .20s, border .10s;
        }
        .service-card:hover {
          box-shadow: 0 6px 36px 0 #32c2fa26;
          border: 1.5px solid #43deff44;
          transform: scale(1.032) translateY(-3px) rotate(-1deg);
        }
        .icon-service {
          font-size: 2.6rem;
          margin-bottom: 6px;
        }
        .mt-extra-large { margin-top: -80px;}
        .bg-card-dark { background: linear-gradient(124deg,#134064,#222850 85%);}
        /* Gradien section review */
        .bg-gradient-review {
          background: linear-gradient(110deg,#e0f7fa 10%, #f3f8ff 90%);
        }
        .testimonial-card {
          background: #fff;
          transition: box-shadow .18s, transform .14s;
        }
        .testimonial-card:hover {
          transform: translateY(-6px) scale(1.03) rotate(-1deg);
          box-shadow: 0 3px 32px #89e2d214;
        }
        /* Benefit */
        .benefit-card {
          min-width: 185px;
        }
        @media (max-width:600px) {.mt-extra-large {margin-top:0;}}
      `}</style>
    </>
  );
};

export default HomePage;