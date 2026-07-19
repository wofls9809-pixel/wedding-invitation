"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { EntryCover } from "./components/EntryCover";
import { Account, BRIDE_ACCOUNTS, GROOM_ACCOUNTS, WEDDING } from "./data/wedding";
import familyArtwork from "../public/family-watercolor.webp";
import giftFlowersArtwork from "../public/final-gift-watercolor.webp";
import rsvpEnvelopeArtwork from "../public/final-message-envelope.webp";
import thankYouArtwork from "../public/thank-you-continuous-watercolor.webp";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add("visible"); observer.unobserve(node); }
    }, { threshold: .1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Ornament() { return <div className="ornament" aria-hidden="true"><span>⌁</span><b>✿</b><span>⌁</span></div>; }
function SectionTitle({ english, korean }: { english: string; korean: string }) {
  return <header className="section-title"><h2>{english}</h2><Ornament /><p>{korean}</p></header>;
}

function WeddingCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, WEDDING.date.getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = remaining === null ? null : Math.floor(remaining / 1000);
  const values = totalSeconds === null
    ? ["--", "--", "--", "--"]
    : [
        Math.floor(totalSeconds / 86400),
        Math.floor((totalSeconds % 86400) / 3600),
        Math.floor((totalSeconds % 3600) / 60),
        totalSeconds % 60,
      ].map(value => String(value).padStart(2, "0"));

  return <Reveal className="wedding-countdown">
    <strong>D - {values[0]}</strong>
    <p>예식일까지 <b>{values[0]}</b>일 남았습니다.</p>
    <div>{["DAY", "HOUR", "MIN", "SEC"].map((label, index) => <span key={label}><b>{values[index]}</b><small>{label}</small></span>)}</div>
  </Reveal>;
}

function AccountGroup({ title, accounts, tone, onCopy }: { title: string; accounts: Account[]; tone: "groom" | "bride"; onCopy: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const panelId = `${tone}-accounts`;
  return <div className={`account-group ${tone}`}>
    <button className="account-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={panelId}>
      <span>{title}</span><b aria-hidden="true">{open ? "−" : "+"}</b>
    </button>
    <div id={panelId} className={`account-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="account-panel-inner"><div className="account-card">{accounts.map(account => <div className="account-row" key={account.number}>
        <div><span>{account.bank}</span><strong>{account.display}</strong><small>예금주&nbsp; {account.holder}</small></div>
        <button onClick={() => onCopy(account.number)}>복사하기</button>
      </div>)}</div></div>
    </div>
  </div>;
}

export default function Home() {
  const [musicOn, setMusicOn] = useState(false);
  const [toast, setToast] = useState("");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [entryVisible, setEntryVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const entryTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current);
  }, []);
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    if (entryVisible) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [entryVisible]);
  const notify = (message: string) => {
    setToast(message);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast("");
      toastTimerRef.current = null;
    }, 1800);
  };
  const copy = async (value: string) => { await navigator.clipboard.writeText(value); notify("계좌번호를 복사했어요"); };
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { try { await audio.play(); setMusicOn(true); } catch { notify("음악 버튼을 한 번 더 눌러주세요"); } }
    else { audio.pause(); setMusicOn(false); }
  };
  const enterInvitation = () => {
    if (isEntering || hasEntered) return;
    setIsEntering(true);
    setHasEntered(true);

    const audio = audioRef.current;
    if (audio) {
      void audio.play().catch(() => setMusicOn(false));
    }

    entryTimerRef.current = window.setTimeout(() => {
      setEntryVisible(false);
      setIsEntering(false);
      window.scrollTo({ top: 0, behavior: "auto" });
      entryTimerRef.current = null;
    }, 1000);
  };
  const goTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const openTmap = () => {
    const destination = encodeURIComponent(`${WEDDING.venue} ${WEDDING.address}`);
    const appUrl = `tmap://search?name=${destination}`;
    const webFallback = "https://www.tmap.co.kr";
    let fallbackTimer = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", stopFallback);
      if (document.visibilityState === "visible") window.location.href = webFallback;
    }, 1400);
    const stopFallback = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = 0;
        document.removeEventListener("visibilitychange", stopFallback);
      }
    };
    document.addEventListener("visibilitychange", stopFallback, { once: true });
    window.location.href = appUrl;
  };
  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = ["[이재린 조미연 웨딩 디너 참석 회신]", `구분: ${data.get("side")}`, `참석 여부: ${data.get("attend")}`, `성함: ${data.get("name")}`, `동행 인원: ${data.get("people")}`, `전달사항: ${data.get("message") || "-"}`].join("\n");
    location.href = `sms:${WEDDING.groomPhone}?body=${encodeURIComponent(message)}`;
  };
  const days = Array.from({ length: 42 }, (_, i) => i - 5);

  return <main className="shell">
    <audio ref={audioRef} src="/music.mp3" loop preload="none" onPlay={() => setMusicOn(true)} onPause={() => setMusicOn(false)} />
    {entryVisible && <EntryCover isLeaving={isEntering} onEnter={enterInvitation} />}
    {hasEntered && <div className="main-invitation is-open">
    <section id="story" className="story panel">
      <button className="story-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="메뉴 열기"><span /><span /><span /></button>
      <div className="family-crop"><Image src={familyArtwork} alt="아기를 품에 안은 가족 수채화 일러스트" sizes="(max-width: 375px) 100vw, 375px" quality={85} loading="eager" /></div>
      <Reveal className="story-copy"><p>서로 다른 길을 걷던 두 사람이<br />같은 길을 걷기로 했습니다.</p><p>그리고</p><p>작은 기적과 함께<br />새로운 가족이 되어갑니다.</p><b>♥</b></Reveal>
    </section>

    <section id="invitation" className="paper panel invitation">
      <Reveal><SectionTitle english="Invitation" korean="초대합니다" /></Reveal>
      <div className="invitation-copy">
        <Reveal><p>저희의 시작과 곧 찾아올 새 생명을 축하해 주세요.</p></Reveal>
        <Reveal><p>복잡한 결혼식 대신,<br />가장 아끼는 분들만 모시고<br />맛있는 식사를 대접하는 자리를 마련했습니다.</p></Reveal>
        <Reveal><p>저희 두 사람이 부부가 되는 첫걸음이자,<br />오는 9월 태어날 아기의 부모가 되는<br />기쁜 소식을 함께 나누고 싶습니다.</p></Reveal>
        <Reveal><p>편안하게 즐기는 자리인 만큼<br />부담 없이 오셔서<br />기쁜 마음으로 자리를 빛내주시면 감사하겠습니다.</p></Reveal>
      </div>
      <div className="dress-code"><h3><span>DRESS CODE</span><i aria-hidden="true">·</i><b>RED POINT</b></h3><p>양복에 넥타이 대신 아기자기한 <em>붉은 꽃핀</em>이나,<br />부담없는 정장 대신 <em>붉은색</em>이 들어간 옷이나 아이템으로<br />센스 있게 포인트를 주고 와주세요.<br />함께 모여 사진을 찍을 때 더욱 예쁜 추억이 될 것 같습니다.</p><p className="dress-code-note">*드레스 코드는 참고만 부탁드리며, 편한 복장으로 오셔도 괜찮습니다. 🤍</p></div>
      <div className="contact-links"><a href={`tel:${WEDDING.groomPhone}`}>신랑에게 전화</a><a href={`tel:${WEDDING.bridePhone}`}>신부에게 전화</a></div>
    </section>

    <section id="date" className="paper panel date">
      <Reveal><SectionTitle english="Date" korean="예식 안내" /></Reveal>
      <div className="calendar-card"><h3>2026.08</h3><div className="week">{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <b className={i === 0 ? "sun" : ""} key={i}>{day}</b>)}</div><div className="days">{days.map((day, i) => <span className={day === 15 ? "selected" : ""} key={i}>{day > 0 && day <= 31 ? day : ""}</span>)}</div></div>
      <div className="event-info"><p>2026. 08. 15 (토)</p><strong>오후 5시</strong><b>{WEDDING.venue}</b><WeddingCountdown /></div>
    </section>

    <section id="location" className="paper panel location">
      <Reveal><SectionTitle english="Location" korean="오시는 길" /></Reveal><h3>{WEDDING.venue}</h3><p className="address">{WEDDING.address}</p>
      <div className="map-illustration" aria-label={`${WEDDING.venue} 약도`}><div className="river"></div><i className="road road-one"></i><i className="road road-two"></i><i className="road road-three"></i><span className="pin">●</span><b>{WEDDING.venue}</b></div>
      <div className="map-links"><a href={`https://map.naver.com/p/search/${encodeURIComponent(WEDDING.address)}`} target="_blank" rel="noreferrer"><i className="naver">N</i>네이버 지도</a><a href={`https://map.kakao.com/link/search/${encodeURIComponent(WEDDING.address)}`} target="_blank" rel="noreferrer"><i className="kakao">●</i>카카오맵</a><button type="button" onClick={openTmap}><i className="tmap">T</i>티맵</button></div>
    </section>

    <section id="gift" className="paper panel gift">
      <Reveal><SectionTitle english="마음 전하기" korean="마음 전하실 곳" /></Reveal><p className="intro-copy">축하해 주시는 따뜻한 마음 감사히 받겠습니다.<br />멀리서 축하해 주실 분들을 위해 안내드립니다.</p>
      <AccountGroup title="신랑측" accounts={GROOM_ACCOUNTS} tone="groom" onCopy={copy} /><AccountGroup title="신부측" accounts={BRIDE_ACCOUNTS} tone="bride" onCopy={copy} />
      <div className="gift-watercolor-art" aria-hidden="true"><Image src={giftFlowersArtwork} alt="" sizes="235px" quality={85} loading="lazy" /></div>
    </section>

    <section id="rsvp" className="paper panel rsvp">
      <Reveal><SectionTitle english="Message" korean="참석 의사" /></Reveal><div className="rsvp-watercolor-envelope" aria-hidden="true"><Image src={rsvpEnvelopeArtwork} alt="" sizes="270px" quality={85} loading="lazy" /></div><p>소중한 걸음<br />진심으로 감사드립니다.<br />행복한 날에 함께 해주세요.</p><button className="primary-button" onClick={() => setRsvpOpen(true)}>✉&nbsp;&nbsp; 참석 여부 전하기</button>
    </section>

    <section id="thanks" className="thanks panel"><div className="thanks-copy"><h2>Thank you</h2><p>귀한 시간 내어 함께해 주셔서<br />진심으로 감사드립니다.</p><time dateTime="2026-08-15">2026.08.15</time></div><div className="thanks-family-frame"><Image src={thankYouArtwork} alt="바닷가에 함께 앉은 가족 수채화 일러스트" sizes="(max-width: 375px) 100vw, 375px" quality={85} loading="lazy" /></div></section>

    <button className={`floating-music ${musicOn ? "playing" : ""}`} onClick={toggleMusic} aria-label={musicOn ? "음악 끄기" : "음악 켜기"}><span aria-hidden="true">{musicOn ? "Ⅱ" : "♫"}</span><small>BGM</small></button>
    {toast && <div className="toast">{toast}</div>}
    {menuOpen && <div className="backdrop nav-backdrop" onClick={() => setMenuOpen(false)}><nav className="nav-sheet" onClick={event => event.stopPropagation()}><button className="close-button" onClick={() => setMenuOpen(false)}>×</button><h3>Wedding Invitation</h3>{[["story", "우리의 이야기"], ["invitation", "초대합니다"], ["date", "예식 안내"], ["location", "오시는 길"], ["gift", "마음 전하실 곳"], ["rsvp", "참석 의사"], ["thanks", "Thank You"]].map(([id, label]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}</nav></div>}
    {rsvpOpen && <div className="backdrop" onClick={() => setRsvpOpen(false)}><div className="modal" onClick={event => event.stopPropagation()}><button className="close-button" onClick={() => setRsvpOpen(false)}>×</button><h3>참석 의사 전달</h3><form onSubmit={submitRsvp}><fieldset><legend>어느 쪽 하객이신가요?</legend><label><input type="radio" name="side" value="신랑측" required /><span>신랑측</span></label><label><input type="radio" name="side" value="신부측" /><span>신부측</span></label></fieldset><fieldset><legend>참석 여부</legend><label><input type="radio" name="attend" value="참석" required /><span>참석</span></label><label><input type="radio" name="attend" value="불참" /><span>불참</span></label></fieldset><label>성함<input name="name" required placeholder="성함을 입력해 주세요" /></label><label>동행 인원 (본인 포함)<input name="people" type="number" min="1" max="20" required /></label><label>전달사항<textarea name="message" maxLength={500} /></label><label className="privacy"><input type="checkbox" required /> 개인정보 수집 및 사용에 동의합니다.</label><button className="primary-button" type="submit">문자로 전송하기</button></form></div></div>}
    </div>}
  </main>;
}
