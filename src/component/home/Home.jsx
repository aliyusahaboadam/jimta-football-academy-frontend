import { useState } from 'react';
import styles from '../style/Home.module.css';

// Joins class names and looks each one up in the CSS module — lets us keep
// writing class lists the same way we would with plain CSS (including
// hyphenated BEM-style names, which can't be reached with styles.foo--bar
// dot notation). Falsy values (false, '', undefined) are skipped, so
// conditional classes read naturally: cx('nav', open && 'nav--open').
function cx(...classes) {
  return classes
    .filter(Boolean)
    .map((name) => styles[name] || name)
    .join(' ');
}

// ---------------------------------------------------------------------------
// Content — pulled into data so programs/stats/gallery/footer stay easy to
// extend later without touching the JSX below.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#programs', label: 'Programs' },
  { href: '#why-us', label: 'About Us' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const STATS = [
  { number: '500+', label: 'Players Trained' },
  { number: '12+', label: 'Certified Coaches' },
  { number: '15', label: 'Years Running' },
  { number: '30+', label: 'Tournament Wins' },
];

const PROGRAMS = [
  {
    image: '/images/card1.jpg',
    alt: 'Junior Academy players during a training drill',
    age: 'Ages 6-12',
    badgeClass: 'badge--secondary',
    title: 'Junior Academy',
    items: [
      'Fundamentals of ball control',
      'Teamwork & discipline basics',
      'Fun, age-appropriate drills',
    ],
  },
  {
    image: '/images/card2.jpg',
    alt: 'Youth Development players in a friendly match',
    age: 'Ages 13-17',
    badgeClass: 'badge--primary',
    title: 'Youth Development',
    items: [
      'Strength & conditioning',
      'Matches vs other academies',
      'Performance tracking',
    ],
  },
  {
    image: '/images/card3.jpg',
    alt: 'Elite Pathway players in advanced training',
    age: 'Ages 18+',
    badgeClass: 'badge--secondary',
    title: 'Elite Pathway',
    items: [
      'Daily training sessions',
      '1-on-1 coaching & video review',
      'Trials with partner clubs',
    ],
  },
  {
    image: '/images/card4.jpg',
    alt: 'Girls football program players on the field',
    age: 'All Ages',
    badgeClass: 'badge--primary',
    title: 'Girls Football',
    items: [
      'Dedicated girls-only sessions',
      'Female coaching staff',
      'Regional friendlies',
    ],
  },
];

const FEATURES = [
  {
    icon: 'team',
    heading: 'Certified, Passionate Coaches',
    body: `Our coaching staff are licensed and experienced, blending modern training
      methods with hands-on mentorship. Every player gets individual attention
      and honest feedback on and off the pitch.`,
    image: '/images/landscape_card1.jpg',
    alt: 'Jimta Football Academy coach guiding players during training',
  },
  {
    icon: 'easy',
    heading: 'A Clear Path From Grassroots to Pro',
    body: `From Junior Academy to the Elite Pathway, every player follows a
      structured development plan with regular assessments and real match
      exposure that opens doors to trials with bigger clubs.`,
    image: '/images/landscape_card2.jpg',
    alt: '',
  },
];

const SHOWCASE_ITEMS = [
  {
    icon: 'snap',
    title: 'Quick Registration & Trials',
    body: `Sign your child up for a trial session in minutes and get a full
      breakdown of which program fits best before the first day of training.`,
  },
  {
    icon: 'graph',
    title: 'Live Performance Tracking',
    body: `Every player's fitness, attendance and match performance is logged so
      parents and coaches see real progress term after term.`,
  },
  {
    icon: 'easy',
    title: 'Direct Coach Feedback',
    body: `After every session, coaches log notes on what each player did well
      and what to work on next, so improvement stays targeted.`,
  },
];

const GALLERY_IMAGES = [
  { src: '/images/gallery1.jpg', alt: 'Players during a training drill' },
  { src: '/images/gallery2.jpg', alt: 'Players in action during a match' },
  { src: '/images/gallery3.jpg', alt: 'Team group photo' },
  { src: '/images/gallery4.jpg', alt: 'Academy training ground' },
  { src: '/images/gallery5.jpg', alt: 'Players celebrating a trophy win' },
  { src: '/images/gallery6.jpg', alt: 'Coach demonstrating a drill' },
  { src: '/images/gallery7.jpg', alt: 'Girls football program players' },
  { src: '/images/gallery8.jpg', alt: 'Players during a fitness session' },
];

const FOOTER_PROGRAMS = [
  'Junior Academy (Ages 6-12)',
  'Youth Development (Ages 13-17)',
  'Elite Pathway (18+)',
  'Girls Football Program',
  'Goalkeeping Clinic',
  'Holiday Football Camps',
];

const FOOTER_SOCIALS = [
  { label: 'X Account', href: 'https://x.com/jimtafootball' },
  { label: 'Instagram', href: 'https://www.instagram.com/jimtafootballacademy?stkn=aDVoMDJjNTc4anR0' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594318624908' },
  { label: 'Tiktok', href: 'https://tiktok.com/@jimtafootballacademy' },
];

const FOOTER_PARTNERS = [
  'Adamawa State FA',
  'Local Sports Clinics',
  'Community Sponsors',
  'Official Kit Partner',
];

// ---------------------------------------------------------------------------

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen((open) => !open);
  const closeNav = () => setNavOpen(false);

  // Footer accordion state — "programs" starts open to match the old
  // static markup; the others start closed. Previously these chevrons had
  // no click handler at all, so nothing happened when you tapped them.
  const [openFooterSections, setOpenFooterSections] = useState({
    programs: true,
    media: false,
    partners: false,
    contact: false,
  });
  const toggleFooterSection = (key) =>
    setOpenFooterSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className={cx('nav', 'collapsible', navOpen && 'collapsible--expanded')}>
        <a className={cx('logo__link')} href="#home">
          <img src="/images/jimta_home_logo.png" alt="Jimta Football Academy logo" />
        </a>

        <div className={cx('collapsible__icon')}>
          <svg
            className={cx('icon', 'icon--primary', 'nav__toggler', 'collapsible__content')}
            onClick={toggleNav}
          >
            <use xlinkHref="/images/sprite.svg#cancel"></use>
          </svg>
        </div>

        <svg
          className={cx('icon', 'icon--primary', 'nav__toggler', 'hide__menu')}
          onClick={toggleNav}
        >
          <use xlinkHref="/images/sprite.svg#menu"></use>
        </svg>

        <ul className={cx('list', 'nav__list', 'collapsible__content')}>
          {NAV_LINKS.map((link) => (
            <li className={cx('nav__item')} key={link.href}>
              <a href={link.href} onClick={closeNav}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>

      <section id="home" className={cx('hero')}>
        <img
          className={cx('hero__image')}
          src="/images/footballer_kicking_ball2.png"
          alt="Jimta Football Academy players training on the pitch"
        />
        <div className={cx('hero__overlay')}>
          <header className={cx('hero__content')}>
            <h1>Train Like A Champion. Play Like A Pro.</h1>
            <p className={cx('hero__tagline')}>
              Jimta Football Academy is Jimeta-Yola's home for football development —
              structured coaching, real match exposure and a clear pathway for players
              of every age, from first touch to first trial.
            </p>
          </header>
        </div>
      </section>

      <section className={cx('stats')}>
        <div className={cx('stats__grid')}>
          {STATS.map((stat) => (
            <div key={stat.label}>
              <span className={cx('stats__number')}>{stat.number}</span>
              <span className={cx('stats__label')}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className={cx('block', 'container', 'programs')}>
        <header className={cx('block__header')}>
          <h2 className={cx('block__heading')}>Programs For Every Age</h2>
          <p>
            From first-touch basics to trials with partner clubs, every player follows a
            structured path built around their age group and level.
          </p>
        </header>

        <div className={cx('programs__grid')}>
          {PROGRAMS.map((program) => (
            <div className={cx('program-card')} key={program.title}>
              <img className={cx('program-card__image')} src={program.image} alt={program.alt} />
              <span className={cx('badge', program.badgeClass, 'program-card__age')}>
                {program.age}
              </span>
              <div className={cx('program-card__body')}>
                <h3 className={cx('program-card__title')}>{program.title}</h3>
                <ul className={cx('list', 'list--tick', 'program-card__list')}>
                  {program.items.map((item) => (
                    <li className={cx('list__item')} key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="why-us">
        <section className={cx('block', 'container')}>
          <header className={cx('block__header')}>
            <h2>Why Choose Jimta Football Academy</h2>
            <p>
              Every session is built around discipline, fitness and a real love for the
              game — coached by people who are invested in each player's growth.
            </p>
          </header>

          {FEATURES.map((feature) => (
            <article className={cx('grid', 'grid--1x2', 'feature')} key={feature.heading}>
              <div className={cx('feature__content')}>
                <span className={cx('icon-container')}>
                  <svg className={cx('icon', 'icon--primary')}>
                    <use xlinkHref={`/images/sprite.svg#${feature.icon}`}></use>
                  </svg>
                </span>
                <h3 className={cx('features__heading')}>{feature.heading}</h3>
                <p>{feature.body}</p>
              </div>

              <picture>
                <img className={cx('feature__image')} src={feature.image} alt={feature.alt} />
              </picture>
            </article>
          ))}
        </section>
      </section>

      <section>
        <section className={cx('block', 'block--primary', 'block--skewed-rigth', 'block-showcase')}>
          <header className={cx('block__header')}>
            <h2>Track Every Player's Progress With Ease</h2>
          </header>

          <div className={cx('grid', 'grid--1x2')}>
            <picture className={cx('block-showcase__image')}>
              <img src="/images/big_card3.jpg" alt="" />
            </picture>

            <ul className={cx('list')}>
              {SHOWCASE_ITEMS.map((item) => (
                <li key={item.title}>
                  <div className={cx('media')}>
                    <div className={cx('media__image')}>
                      <svg className={cx('icon', 'icon--white')}>
                        <use xlinkHref={`/images/sprite.svg#${item.icon}`}></use>
                      </svg>
                    </div>
                    <div className={cx('media__body')}>
                      <h3 className={cx('media__title')}>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>

      <section id="gallery" className={cx('block', 'container')}>
        <header className={cx('block__header')}>
          <h2>Life At The Academy</h2>
          <p>A look at training days, match days and the moments in between.</p>
        </header>

        <div className={cx('gallery__grid')}>
          {GALLERY_IMAGES.map((image) => (
            <div className={cx('gallery__item')} key={image.src}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <section className={cx('block')}>
          <header className={cx('block__header')}>
            <h2>Meet Our President</h2>
            <p>The vision behind Jimta Football Academy.</p>
          </header>
          <div className={cx('container')}>
            <div className={cx('card', 'testimonial')}>
              <div className={cx('grid', 'grid--1x2')}>
                <div className={cx('testimonial__image')}>
                  <img
                    src="/images/Hon Usman Maulud.jpg"
                    alt="Hon. Usman Maulud, President of Jimta Football Academy"
                  />
                  <span className={cx('icon-container')}>
                    <svg className={cx('icon', 'icon--primary', 'icon--small')}>
                      <use xlinkHref="/images/sprite.svg#quote"></use>
                    </svg>
                  </span>
                </div>

                <blockquote className={cx('quote')}>
                  <p className={cx('quote__text')}>
                    My vision for Jimta Football Academy is to provide young talents with the
                    right environment, coaching, discipline, and opportunities to develop
                    their abilities and reach their full potential.
                  </p>
                  <footer>
                    <div className={cx('media')}>
                      <div className={cx('media__image')}>
                        <svg className={cx('icon', 'icon--secondary', 'quote__line')}>
                          <use xlinkHref="/images/sprite.svg#hyphen"></use>
                        </svg>
                      </div>
                      <div className={cx('media__body')}>
                        <h3 className={cx('media__title', 'quote__author')}>Hon. Usman Maulud</h3>
                        <p className={cx('quote__organization')}>President</p>
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className={cx('block', 'container')}>
        <div className={cx('callout', 'callout--primary', 'grid', 'grid--1x2')}>
          <div className={cx('callout__content')}>
            <h2 className={cx('callout__heading')}>Ready To Join Jimta Football Academy?</h2>
            <p>Spaces for the next intake are filling up. Book a free trial session today.</p>
          </div>
        </div>
      </section>

      <section id="contact">
        <footer className={cx('block', 'block--primary', 'footer')}>
          <div className={cx('container', 'grid', 'footer__sections')}>
            <section className={cx('collapsible', openFooterSections.programs && 'collapsible--expanded', 'footer__section')}>
              <header className={cx('collapsible__header')} onClick={() => toggleFooterSection('programs')}>
                <h2 className={cx('collapsible__heading', 'footer__heading')}>Our Programs</h2>
                <span className={cx('icon-container')}>
                  <svg className={cx('icon', 'icon--primary', 'icon--white', 'collapsible--chevron')}>
                    <use xlinkHref="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>

              <div className={cx('collapsible__content')}>
                <ul className={cx('list')}>
                  {FOOTER_PROGRAMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={cx('collapsible', openFooterSections.media && 'collapsible--expanded', 'footer__section')}>
              <header className={cx('collapsible__header')} onClick={() => toggleFooterSection('media')}>
                <h2 className={cx('collapsible__heading', 'footer__heading')}>Media Platform</h2>
                <span className={cx('icon-container')}>
                  <svg className={cx('icon', 'icon--primary', 'icon--white', 'collapsible--chevron')}>
                    <use xlinkHref="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>

              <div className={cx('collapsible__content')}>
                <ul className={cx('list')}>
                  {FOOTER_SOCIALS.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noreferrer">{social.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={cx('collapsible', openFooterSections.partners && 'collapsible--expanded', 'footer__section')}>
              <header className={cx('collapsible__header')} onClick={() => toggleFooterSection('partners')}>
                <h2 className={cx('collapsible__heading', 'footer__heading')}>Partners</h2>
                <span className={cx('icon-container')}>
                  <svg className={cx('icon', 'icon--primary', 'icon--white', 'collapsible--chevron')}>
                    <use xlinkHref="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>

              <div className={cx('collapsible__content')}>
                <ul className={cx('list')}>
                  {FOOTER_PARTNERS.map((partner) => (
                    <li key={partner}>{partner}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={cx('collapsible', openFooterSections.contact && 'collapsible--expanded', 'footer__section')}>
              <header className={cx('collapsible__header')} onClick={() => toggleFooterSection('contact')}>
                <h2 className={cx('collapsible__heading', 'footer__heading')}>Contact Us</h2>
                <span className={cx('icon-container')}>
                  <svg className={cx('icon', 'icon--primary', 'icon--white', 'collapsible--chevron')}>
                    <use xlinkHref="/images/sprite.svg#chevron"></use>
                  </svg>
                </span>
              </header>

              <div className={cx('collapsible__content')}>
                <p>Address: Jimeta-Yola, Adamawa State, Nigeria.</p>
                <p>Tel: +234(0) 8036502423</p>
                <p>Mail: jimtafootballacademy@gmail.com</p>
                <p>WhatsApp: +234(0) 8036502423</p>
              </div>
            </section>

            <section className={cx('footer__brand')}>
              <img src="/images/jimta_home_logo.png" alt="Jimta Football Academy logo" />
              <p className={cx('footer__copyright')}>
                Copyright 2026 Jimta Football Academy, All Rights Reserved.
              </p>
            </section>
          </div>
        </footer>
      </section>
    </>
  );
}