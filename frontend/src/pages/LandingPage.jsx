import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { ArrowRight, LayoutTemplate, Menu, X, Zap, Download } from 'lucide-react';
import { landingPageStyles } from "../assets/dummystyle";
import { ProfileInfoCard } from '../components/Cards.jsx';
import Login from '../components/Login.jsx';
import Modal from '../components/Modal.jsx';
import SignUp from '../components/SignUp.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import SubscriptionCards from '../components/SubscriptionCards.jsx';
import { useTranslation } from 'react-i18next'

const LandingPage = () => {
    // Destructure i18n from useTranslation for language changing
    const { t, i18n } = useTranslation();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // State variables remain the same as per the original file
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleCTA = () => {
        if (!user) {
            setOpenAuthModal(true)
        }
        else {
            navigate('/dashboard')
        }
    }

    const styles = landingPageStyles;

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    {/* LOGO SECTION - Content kept as original (ResumePath) */}
                    <div className={styles.logoContainer}>
                        <div className={styles.logoIcon}>
                            <LayoutTemplate className={styles.logoIconInner} />
                        </div>
                        <span className={styles.logoText}>ResumePath</span>
                    </div>

                    {/* DESKTOP LANGUAGE SWITCHER */}
                    <div className="hidden md:flex mr-6">
                        <LanguageSwitcher />
                    </div>

                    {/* MOBILE MENU BUTTON (Functionality unchanged) */}
                    <button
                        className={styles.mobileMenuButton}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X size={24} className={styles.mobileMenuIcon} />
                        ) : (
                            <Menu size={24} className={styles.mobileMenuIcon} />
                        )}
                    </button>

                    {/* DESKTOP AUTH BUTTON / PROFILE CARD */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <ProfileInfoCard />
                        ) : (
                            <button
                                className={styles.desktopAuthButton}
                                onClick={() => setOpenAuthModal(true)}
                            >
                                <div className={styles.desktopAuthButtonOverlay}></div>
                                <span className={styles.desktopAuthButtonText}>
                                    {t("LogIn/SignUp ")} {/* i18n change */}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN (i18n added for text) */}
                {mobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <div className={styles.mobileMenuContainer}>
                            {/* MOBILE LANGUAGE SWITCHER */}
                            <div className="flex justify-center py-3 border-b border-gray-200 dark:border-gray-700">
                                <LanguageSwitcher className="flex gap-4" buttonClass="text-sm" activeClass="font-bold text-indigo-600" inactiveClass="" />
                            </div>

                            {user ? (
                                <div className={styles.mobileUserInfo}>
                                    <div className={styles.mobileUserWelcome}>
                                        {t("welcome Back")} {/* i18n change */}
                                    </div>
                                    <button className={styles.mobileDashboardButton}
                                        onClick={() => {
                                            navigate('/dashboard');
                                            setMobileMenuOpen(false);
                                        }}>
                                        {t("goToDashboard")} {/* i18n change */}
                                    </button>
                                </div>
                            ) : (
                                <button className={styles.mobileAuthButton}
                                    onClick={() => {
                                        setOpenAuthModal(true)
                                        setMobileMenuOpen(false)
                                    }}>
                                    {t("Get Start")} {/* i18n change */}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT AREA */}
            <main className={styles.main}>
                {/* HERO SECTION */}
                <section className={styles.heroSection}>
                    <div className={styles.heroGrid}>
                        {/* LEFT PANEL: VALUE PROPOSITION (i18n added) */}
                        <div className={styles.heroLeft}>
                            <div className={styles.tagline}>
                                {t("Build your professional resumes with ResumePath")} {/* i18n change */}
                            </div>

                            <h1 className={styles.heading}>
                                <span className={styles.headingText}>{t("blueCollar")}</span> {/* i18n change */}
                                <span className={styles.headingGradient}>{t("professional")}</span> {/* i18n change */}
                                <span className={styles.headingText}>{t("resumes")}</span> {/* i18n change */}
                            </h1>

                            <p className={styles.description}>
                                {t("heroDescription")} {/* i18n change */}
                            </p>

                            <div className={styles.ctaButtons}>
                                <button className={styles.primaryButton}
                                    onClick={handleCTA}>
                                    <div className={styles.primaryButtonOverlay}></div>
                                    <span className={styles.primaryButtonContent}>
                                        {t("startBuilding")} {/* i18n change */}
                                        <ArrowRight className={styles.primaryButtonIcon} size={18} />
                                    </span>
                                </button>

                                <button className={styles.secondaryButton} onClick={handleCTA}>
                                    {t("viewTemplates")} {/* i18n change */}
                                </button>
                            </div>

                            {/* PROFESSIONAL STATS */}
                            <div className={styles.statsContainer}>
                                {[
                                    { value: '50K+', labelKey: 'resumesCreated', gradient: 'from-violet-600 to-fuchsia-600' },
                                    { value: '4.9★', labelKey: 'userRating', gradient: 'from-orange-500 to-red-500' },
                                    { value: '5 Min', labelKey: 'buildTime', gradient: 'from-emerald-500 to-teal-500' }
                                ].map((stat, idx) => (
                                    <div className={styles.statItem} key={idx}>
                                        <div className={`${styles.statNumber} ${stat.gradient}`}>
                                            {stat.value}
                                        </div>
                                        <div className={styles.statLabel}>{t(stat.labelKey)}</div> {/* i18n change */}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT PANEL: ILLUSTRATION  */}
                        <div className={styles.heroIllustration}>
                            <div className={styles.heroIllustrationBg}></div>
                            <div className={styles.heroIllustrationContainer}>
                                <svg
                                    viewBox="0 0 400 500"
                                    className={styles.svgContainer}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* Definitions and SVG Elements are preserved to maintain original functionality */}
                                    <defs>
                                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#d946ef" />
                                        </linearGradient>
                                        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#f8fafc" />
                                        </linearGradient>
                                    </defs>

                                    {/* SVG elements use the updated styles */}
                                    <rect x="50" y="50" width="300" height="400" rx="20" className={styles.svgRect} />
                                    <circle cx="120" cy="120" r="25" className={styles.svgCircle} />
                                    <rect x="160" y="105" width="120" height="8" rx="4" className={styles.svgRectPrimary} />
                                    <rect x="160" y="120" width="80" height="6" rx="3" className={styles.svgRectSecondary} />
                                    <rect x="70" y="170" width="260" height="4" rx="2" className={styles.svgRectLight} />
                                    <rect x="70" y="185" width="200" height="4" rx="2" className={styles.svgRectLight} />
                                    <rect x="70" y="200" width="240" height="4" rx="2" className={styles.svgRectLight} />
                                    <rect x="70" y="230" width="60" height="6" rx="3" className={styles.svgRectPrimary} />
                                    <rect x="70" y="250" width="40" height="15" rx="7" className={styles.svgRectSkill} />
                                    <rect x="120" y="250" width="50" height="15" rx="7" className={styles.svgRectSkill} />
                                    <rect x="180" y="250" width="45" height="15" rx="7" className={styles.svgRectSkill} />
                                    <rect x="70" y="290" width="80" height="6" rx="3" className={styles.svgRectSecondary} />
                                    <rect x="70" y="310" width="180" height="4" rx="2" className={styles.svgRectLight} />
                                    <rect x="70" y="325" width="150" height="4" rx="2" className={styles.svgRectLight} />
                                    <rect x="70" y="340" width="200" height="4" rx="2" className={styles.svgRectLight} />

                                    <circle cx="320" cy="100" r="15" className={styles.svgAnimatedCircle}>
                                        <animateTransform
                                            attributeName="transform"
                                            type="translate"
                                            values="0,0; 0,-10; 0,0"
                                            dur="3s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <rect x="30" y="300" width="12" height="12" rx="6" className={styles.svgAnimatedRect}>
                                        <animateTransform
                                            attributeName="transform"
                                            type="translate"
                                            values="0,0; 5,0; 0,0"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </rect>
                                    <polygon points="360,200 370,220 350,220" className={styles.svgAnimatedPolygon}>
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            values="0 360 210; 360 360 210; 0 360 210"
                                            dur="4s"
                                            repeatCount="indefinite"
                                        />
                                    </polygon>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className={styles.featuresContainerSection}>
                    <div className={styles.featuresContainer}>
                        <div className={styles.featuresHeader}>
                            <h2 className={styles.featuresTitle}>
                                {t("whyChoose")} <span className={styles.featuresTitleGradient}> {/*  i18n change */}
                                    ResumePath?
                                </span>
                            </h2>
                            <p className={styles.featuresDescription}>
                                {t("whyChooseDesc")} {/*  i18n change */}
                            </p>
                        </div>

                        <div className={styles.featuresGrid}>
                            {[
                                {
                                    icon: <Zap className={styles.featureIcon} />,
                                    titleKey: "featureFast",
                                    descriptionKey: "featureFastDesc",
                                    gradient: styles.featureIconViolet,
                                    bg: styles.featureCardViolet
                                },
                                {
                                    icon: <LayoutTemplate className={styles.featureIcon} />,
                                    titleKey: "featureTemplates",
                                    descriptionKey: "featureTemplatesDesc",
                                    gradient: styles.featureIconFuchsia,
                                    bg: styles.featureCardFuchsia
                                },
                                {
                                    icon: <Download className={styles.featureIcon} />,
                                    titleKey: "featureExport",
                                    descriptionKey: "featureExportDesc",
                                    gradient: styles.featureIconOrange,
                                    bg: styles.featureCardOrange
                                }
                            ].map((feature, index) => (
                                <div key={index} className={styles.featureCard}>
                                    <div className={styles.featureCardHover}></div>
                                    <div className={`${styles.featureCardContent} ${feature.bg}`}>
                                        <div className={`${styles.featureIconContainer} ${feature.gradient}`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className={styles.featureTitle}>
                                            {t(feature.titleKey)} {/*  i18n change */}
                                        </h3>
                                        <p className={styles.featureDescription}> {t(feature.descriptionKey)} </p> {/*  i18n change */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION (i18n added and full styling restored) */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <div className={styles.ctaCard}>
                            <div className={styles.ctaCardBg}></div>
                            <div className={styles.ctaCardContent}>
                                <h2 className={styles.ctaTitle}>
                                    {t("finalCTA")} {/*  i18n change */}
                                </h2>
                                <p className={styles.ctaDescription}>
                                    {t("finalCTADesc")} {/*  i18n change */}
                                </p>
                                <button className={styles.ctaButton} onClick={handleCTA}>
                                    <div className={styles.ctaButtonOverlay}></div>
                                    <span className={styles.ctaButtonText}>{t("getStartedNow")}</span> {/*  i18n change */}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* SUBSCRIPTION CARDS SECTION */}
            <SubscriptionCards onGetStarted={() => setOpenAuthModal(true)} />

            {/* FOOTER  */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <p className={styles.footerText}>
                        © {new Date().getFullYear()} ResumePath. {t("craftedBy")} <span className={styles.footerHeart}>❤️</span>{' '} {/*  i18n change */}
                        <a href="#" className={styles.footerLink}>TeamErrorist</a>
                    </p>
                </div>
            </footer>

            {/* AUTHENTICATION MODAL  */}
            <Modal isOpen={openAuthModal} onClose={() => {
                setOpenAuthModal(false)
                setCurrentPage("login")
            }} hideHeader>
                <div>
                    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
                    {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
                </div>
            </Modal>
        </div>
    );
};

export default LandingPage;