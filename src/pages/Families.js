import React from "react";
import { Link } from "react-router-dom";
import { useReveal, SecHead } from "../lib/ui";
import { Ico } from "../lib/icons";

const oriIcon = "/fam_icons/ori.png";
const goyangIcon = "/fam_icons/goyang.png";
const sajaIcon = "/fam_icons/saja.png";

const FAMILIES = [
    {
        name: "Ori",
        han: "오리",
        theme: "green",
        icon: oriIcon,
        instagram: "https://www.instagram.com/ksa.ori/",
        famheads: [
            {
                name: "Will Choi",
                location: "Fairfax, VA",
                year: "2nd Year",
                major: "Data Science",
                mbti: "ISFP",
                bio: "what's good ori fam! my name's will and I will be one of your famheads for this year. My MBTI is ISFP, and some of my interests include music, sports, and gaming. My favorite music genre is definitely rnb or krnb. I am a huge soccer fan, so if you wanna talk ball, im always here. i hope to get to know y'all and bring you guys a pleasant experience in KSA!",
            },
            {
                name: "Divine Nwadike",
                location: "Bronx, NY",
                year: "3rd Year",
                major: "Commerce",
                mbti: "INFP",
                bio: "Hey ori fam, my name is divine and I will be one of your famheads for this year. My MBTI is INFP, some of my interests are music, drawing and watching stuff. My favorite genre of music ranges from underground rap to rnb. I'm a big Knicks fan and I'm also big into anime so if anyone wants to talk about that let me know.",
            },
            {
                name: "Dahyun Lee",
                location: "Woodbridge, VA",
                year: "3rd Year",
                major: "Behavioral Neuroscience",
                mbti: "INFJ",
                bio: "Wassup famm I'm Dahyun, MBTI is INFJ and I love music, cars, and nature. You'll always catch me listening to some type of rnb/hiphop/rap driving around Cville. I like all sports but I mainly play lacrosse, pickleball, volleyball, and basketball. I love being outdoors and am always driving people around grounds so you might see my KIA from time to time.",
            },
            {
                name: "Jeyoung Yoo",
                location: "Seoul, South Korea",
                year: "4th Year",
                major: "Global Public Health, Biology",
                mbti: "ENFJ",
                bio: "Hello everyone! My name is Je Young, and I look forward to seeing everyone come the school year :)) In terms of interests, I like to run and read in my spare time, but also like to do any activity through which I can have fun and get to know more about those around me. In terms of music, I listen to a wide variety, but I particularly listen to 80s-00s Korean songs as well as house. I also follow soccer (Olympique Lyonnais) and gridiron football (Go Ravens!), with a bit of baseball in between (Kiwoom and Nats). Fun facts about me are that I can name every country in the world, and I attended international school. If you see me walking between classes or out on the Corner, feel free to say hi. See you all soon!",
            },
        ],
    },
    {
        name: "Goyangi",
        han: "고양이",
        theme: "blue",
        icon: goyangIcon,
        instagram: "https://www.instagram.com/goyangifam/",
        famheads: [
            {
                name: "Rachel Yi",
                location: "Aldie, VA",
                year: "2nd Year",
                major: "Studio Art",
                mbti: "INFJ-T",
                bio: "hello goyangis!! i'm rachel and i'm so excited to be your famhead! some things about me, i'm an infj-t and i love ALL things creative (can assume by my major...). i would consider myself a spotify addict, and i love any and all genres/artists — ariana grande, bts, chase atlantic, kpop, etc. i LOVE shopping and having a good time. this usually means getting food, photobooths, doing fun activities/side quests. i also love anything matcha/coffee, taking pictures, going out, fashion, traveling, and more! i'm looking forward to meeting all of our goyangis soon! <3",
            },
            {
                name: "Caden Truvan",
                location: "Fairfax, VA",
                year: "2nd Year",
                major: "Economics",
                mbti: "INTJ",
                bio: "(intj) hello goyangi fam — my name is caden and i am stoked to be one of your famheads for this school year! i love sidequesting with friends, listening to music, and being chronically online. on grounds, you'll probably see me speedwalking to class or in line for nok matcha.",
            },
            {
                name: "Neyla Ngo",
                location: "Chantilly, VA",
                year: "2nd Year",
                major: "DM: Economics and Psychology, Minor: General Business",
                mbti: "ENFJ-T",
                bio: "I am an ENFJ-T who loves all things creative from music to painting to writing. When it comes to food, \"picky eater\" is definitely something I would NEVER say about myself. I listen to all kinds of music, yes, even some country. My favorite ways to spend time with others are those that allow for good conversation and fun at the same time. Can't wait to meet all of you, let's have a blast this year!",
            },
            {
                name: "Alejandro Rodriguez",
                location: "Springfield, VA",
                year: "3rd Year",
                major: "Mech Engineering",
                mbti: "ENFJ",
                bio: "I am an ENFJ, and some of my interests include dancing, photography, and listening to or reading horror stories. My favorite music genre right now is R&B, but my all-time favorite is reggaeton. The two sports I mildly follow are soccer and MMA, with my favorite fighter being Alex Pereira and my favorite soccer player being Neymar. I currently have 12 ear piercings, and I really love Coke Zero.",
            },
        ],
    },
    {
        name: "Saja",
        han: "사자",
        theme: "orange",
        icon: sajaIcon,
        instagram: "https://www.instagram.com/ksa_saja_fam/",
        famheads: [
            {
                name: "Esther Kong",
                location: "South Riding, VA",
                year: "3rd Year",
                major: "Neuroscience",
                mbti: "ESTJ",
                bio: "Hello i'm Esther! My MBTI is ESTJ and some fun things I like to do are crocheting, going to the movies, thrifting, watching mukbangs, and going on runs 🐯 some of my favorites are beach days, kimchi jjigae (comfort food), debriefs with friends, sunset watching, and house music!",
            },
            {
                name: "Pierce Tan",
                location: "Blacksburg, VA",
                year: "3rd Year",
                major: "Physics",
                mbti: null,
                bio: "Hi KSA my name is Pierce Tan and I am happy to be one of your Saja famheads for this upcoming year! I enjoy playing board games, bouldering (come climbing with me !!), and weightlifting. I also enjoy reading and the last good book I read \"Wind and Truth\" by Brandon Sanderson. I am going to be an RA at Kent/Dabney this year so please try not to PUBS there if you can...",
            },
            {
                name: "Ryan Zhao",
                location: "Blacksburg, VA",
                year: "3rd Year",
                major: "Commerce",
                mbti: null,
                bio: "Hi Saja Fam, my name is Ryan and I will be one of your famheads for this year. Some of my interests include tennis, any other sports, and food. I've been listening to a lot of Noah Kahan and Shaboozey. I also really like to listen to soundtracks from movies, tv series and games. I'm excited to be a fam head this year and look forward to meeting you all!",
            },
            {
                name: "Talaal Maxood",
                location: "Richmond, VA",
                year: "4th Year",
                major: "Computer Science",
                mbti: "INFP-T",
                bio: "Yo Saja. My name is Talaal and I will be one of your famheads this year. My MBTI is INFP-T, and some of my interests include reading, manga/anime, videogames, music, cooking, and more reading. My favorite music genre doesn't exist but my favorite artists are like, Noah Kahan, Metro Boomin, Fuji Kaze. I don't rlly watch sports but I will larp about them if you need. Look forward to getting to know yall.",
            },
        ],
    },
];

function FamheadCard({ f, i }) {
    return (
        <div className={"card lift fh-card reveal d" + ((i % 3) + 1)}>
            <span className="fh-star" aria-hidden="true">★</span>
            <div className="fh-card__top">
                <div className="fh-avatar" aria-hidden="true">
                    {f.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                    <h4 className="fh-name">{f.name}</h4>
                    <p className="fh-meta">{f.location} &middot; {f.year}</p>
                    <p className="fh-meta fh-meta--major">{f.major}</p>
                </div>
            </div>
            <p className="fh-bio">{f.bio}</p>
            {f.mbti && (
                <div className="fh-foot">
                    <span className="chip chip--mbti">{f.mbti}</span>
                </div>
            )}
        </div>
    );
}

function FamilyBlock({ fam }) {
    return (
        <section className={"fam-block fam-block--" + fam.theme}>
            <div className="fam-block__deco" aria-hidden="true">
                <span className="deco-star deco-star--1">★</span>
                <span className="deco-star deco-star--2">✦</span>
                <span className="deco-star deco-star--3">★</span>
                <span className="deco-star deco-star--4">✦</span>
            </div>
            <div className="wrap" style={{ position: "relative" }}>
                <div className="fam-block__head reveal">
          <span className="eyebrow eyebrow--light">
            <i className="kicker-dot" />Family Reveal<span className="han">{fam.han}</span>
          </span>
                    <h2 className="h-display fam-block__title">
                        <img src={fam.icon} alt={`${fam.name} icon`} className="fam-block__icon" />{fam.name}
                    </h2>
                    <a
                        href={fam.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fam-block__ig"
                    >
                        {Ico.arrow({ className: "arrow", width: 15, height: 15 })}
                        Follow @{fam.instagram.split("/").filter(Boolean).pop()}
                    </a>
                </div>
                <div className="fh-grid">
                    {fam.famheads.map((f, i) => (
                        <FamheadCard f={f} i={i} key={f.name} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Families() {
    useReveal();
    return (
        <div className="page">
            <section className="fhero">
                <div className="pattern" style={{ opacity: 0.1 }} />
                <div className="wrap" style={{ position: "relative" }}>
                    <div className="fhero__grid">
                        <div className="reveal fhero__copy">
                            <span className="eyebrow eyebrow--light"><i className="kicker-dot" />KSA Families<span className="han">가족</span></span>
                            <h1 className="h-display" style={{ margin: "18px 0 16px" }}>Your home<br />away from home.</h1>
                            <p className="lead" style={{ color: "#D6DEF2", maxWidth: 480, marginBottom: 26 }}>
                                Saja, Ori, and Goyangi. Meet the people who will be your best friends,
                                and participate in the best events you can find on campus!!
                            </p>
                            <span className="chip chip--ink"><span className="f-soon-dot" />Meet the Famheads!!</span>
                        </div>
                    </div>
                </div>
            </section>


            {FAMILIES.map((fam) => (
                <FamilyBlock fam={fam} key={fam.name} />
            ))}


            <style>{`
        .fhero { background: var(--ink); color: #fff; padding: 140px 0 140px; position: relative; overflow: hidden; }
        .fhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(900px 420px at 12% 0%, rgba(10,63,168,0.55), transparent 60%), radial-gradient(820px 380px at 95% 100%, rgba(205,46,58,0.45), transparent 60%); }
        .fhero::before { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 180px; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%); pointer-events: none; z-index: 1; }
        .fhero .wrap { z-index: 2; }
        .fhero__grid { display: grid; grid-template-columns: 1fr; justify-items: center; }
        .fhero__copy { text-align: center; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        .f-soon-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--red-soft); box-shadow: 0 0 0 0 rgba(226,84,94,0.6); animation: pulse 2s infinite; }
        .f-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-bottom: 8px; }
        .f-card { padding: 30px 26px; }
        .f-card-num { font-size: 2rem; font-weight: 900; letter-spacing: -0.04em; color: var(--blue); opacity: 0.25; }
        .f-cta { text-align: center; background: var(--paper-2); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 52px 24px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(226,84,94,0.6); } 70% { box-shadow: 0 0 0 9px rgba(226,84,94,0); } 100% { box-shadow: 0 0 0 0 rgba(226,84,94,0); } }

        /* Family reveal blocks */
        .fam-block { padding: 96px 0; color: #fff; position: relative; overflow: hidden; }
        .fam-block--green { background: linear-gradient(150deg, #0d3d29 0%, #1c7a4c 55%, #0e3b28 100%); }
        .fam-block--blue { background: linear-gradient(150deg, #0b2450 0%, #1a56ac 55%, #0c2a52 100%); }
        .fam-block--orange { background: linear-gradient(150deg, #8a3d0a 0%, #f0932b 55%, #b5560f 100%); }

        .fam-block::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 200px; background: linear-gradient(180deg, var(--ink) 0%, rgba(0,0,0,0) 100%); opacity: 0.6; pointer-events: none; z-index: 0; }

        .fam-block__deco { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
        .deco-star { position: absolute; font-size: 2.6rem; color: rgba(255,255,255,0.16); animation: float 7s ease-in-out infinite; }
        .deco-star--1 { top: 6%; left: 5%; font-size: 3.2rem; animation-delay: 0s; }
        .deco-star--2 { top: 68%; left: 10%; font-size: 2rem; animation-delay: 1.2s; }
        .deco-star--3 { top: 12%; right: 8%; font-size: 2.4rem; animation-delay: 0.6s; }
        .deco-star--4 { bottom: 8%; right: 12%; font-size: 3.4rem; animation-delay: 1.8s; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }

        .fam-block .wrap { position: relative; z-index: 1; }

        .fam-block__head { text-align: center; margin-bottom: 48px; }
        .fam-block__title { margin: 10px 0 18px; font-size: 3.2rem; display: flex; align-items: center; justify-content: center; gap: 16px; }
        .fam-block__icon { width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.25)); animation: wiggle 3s ease-in-out infinite; }
        @keyframes wiggle { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        .fam-block__ig { display: inline-flex; align-items: center; gap: 7px; font-size: 0.9rem; font-weight: 800; color: #1a1a1a; background: #fff; padding: 10px 20px; border-radius: var(--r-pill); text-decoration: none; box-shadow: 0 6px 0 rgba(0,0,0,0.18); transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .fam-block__ig:hover { transform: translateY(-2px); box-shadow: 0 8px 0 rgba(0,0,0,0.18); }
        .fam-block__ig:active { transform: translateY(2px); box-shadow: 0 3px 0 rgba(0,0,0,0.18); }

        .fh-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .fh-card { background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.22); border-radius: var(--r-lg); padding: 28px; backdrop-filter: blur(6px); color: #fff; position: relative; overflow: hidden; transition: transform 0.2s ease, border-color 0.2s ease; }
        .fh-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.45); }
        .fh-star { position: absolute; top: 14px; right: 16px; font-size: 1.3rem; color: rgba(255,255,255,0.3); }
        .fh-card__top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .fh-avatar { width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0; }
        .fh-name { margin: 0 0 2px; font-size: 1.18rem; }
        .fh-meta { margin: 0; font-size: 0.82rem; color: rgba(255,255,255,0.78); }
        .fh-meta--major { color: rgba(255,255,255,0.6); }
        .fh-bio { font-size: 0.9rem; line-height: 1.55; color: rgba(255,255,255,0.88); margin: 0 0 16px; }
        .fh-foot { display: flex; align-items: center; gap: 12px; }
        .chip--mbti { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); font-weight: 800; letter-spacing: 0.02em; }

        @media (max-width: 880px) {
          .f-cards { grid-template-columns: 1fr; }
          .fh-grid { grid-template-columns: 1fr; }
          .fam-block__title { font-size: 2.2rem; flex-direction: column; gap: 10px; }
          .fam-block__icon { width: 48px; height: 48px; }
          .deco-star { font-size: 1.6rem !important; }
        }
      `}</style>
        </div>
    );
}