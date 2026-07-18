"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import styles from "./page.module.css";

const WEDDING = {
  groom: "재린",
  bride: "MJ",
  date: "2026. 09. 22",
  time: "오후 1시",
  venue: "예식장 이름",
  hall: "웨딩홀 · 0층",
  address: "예식장 주소를 입력해 주세요",
  mapUrl: "https://map.kakao.com/",
  invitation: [
    "서로의 일상에 가장 다정한 사람이 되어",
    "이제 한 가족으로 같은 계절을 걸어가려 합니다.",
    "",
    "저희의 새로운 시작에 함께하시어",
    "따뜻한 축복을 나누어 주시면 감사하겠습니다."
  ],
  family: {
    groomFather: "아버지",
    groomMother: "어머니",
    brideFather: "아버지",
    brideMother: "어머니"
  },
  accounts: [
    { side: "신랑측", bank: "○○은행", number: "000-0000-0000", holder: "이재린" },
    { side: "신부측", bank: "○○은행", number: "000-0000-0000", holder: "MJ" }
  ]
};

const days = [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 34, scale: 0.985 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 1.05, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <header className={styles.sectionHeader}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <i aria-hidden="true">✦</i>
    </header>
  );
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {
      window.prompt("아래 내용을 복사해 주세요.", text);
    }
  }
  return <button className={styles.copyButton} onClick={copy}>{done ? "복사 완료" : "계좌 복사"}</button>;
}

export default function Home() {
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 82]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const [shareDone, setShareDone] = useState(false);

  async function share() {
    const data = { title: "재린 ♥ MJ 결혼합니다", text: "소중한 분들을 저희의 특별한 날에 초대합니다.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setShareDone(true);
        setTimeout(() => setShareDone(false), 1500);
      }
    } catch {}
  }

  return (
    <main className={styles.shell}>
      <section ref={heroRef} className={styles.cover}>
        <motion.div className={styles.cloudOne} animate={reduce ? {} : { x: [0, 28, 0], y: [0, -7, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className={styles.cloudTwo} animate={reduce ? {} : { x: [0, -24, 0], y: [0, 8, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className={styles.coverText} style={reduce ? {} : { y: titleY, opacity: titleOpacity }} initial={reduce ? false : { opacity: 0, y: 24 }} animate={reduce ? {} : { opacity: 1, y: 0 }} transition={{ duration: 1.25, ease }}>
          <span>WEDDING INVITATION</span>
          <h1>{WEDDING.groom}<em>and</em>{WEDDING.bride}</h1>
          <p>{WEDDING.date}</p>
        </motion.div>
        <motion.div className={styles.coverArt} style={reduce ? {} : { y: artY }} initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={reduce ? {} : { opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: .15, ease }}>
          <Image src="/images/cover-family.svg" alt="여름 바닷가의 신랑, 신부와 아기 수채화 일러스트" width={900} height={1200} priority />
        </motion.div>
        <p className={styles.scrollHint}><span />SCROLL</p>
      </section>

      <section className={`${styles.section} ${styles.familySection}`}>
        <Reveal><SectionTitle eyebrow="OUR FAMILY" title="셋이 맞이하는 첫 번째 여름" /></Reveal>
        <Reveal delay={.08} className={styles.floatingArt}>
          <Image src="/images/picnic-family.svg" alt="바닷가 피크닉을 즐기는 세 가족의 수채화 일러스트" width={900} height={840} />
        </Reveal>
        <Reveal delay={.16}><p className={styles.poem}>둘이 만나 사랑을 배우고,<br />작은 기적이 찾아와 셋이 되었습니다.<br />가장 따뜻한 계절에<br />저희 가족의 첫 장을 열려 합니다.</p></Reveal>
      </section>

      <section className={`${styles.section} ${styles.invitationSection}`}>
        <Reveal><SectionTitle eyebrow="INVITATION" title="소중한 분들을 초대합니다" /></Reveal>
        <div className={styles.letter}>
          {WEDDING.invitation.map((line, index) => line ? <Reveal key={index} delay={index * .07}><p>{line}</p></Reveal> : <br key={index} />)}
        </div>
        <Reveal delay={.18}>
          <div className={styles.parents}>
            <p><strong>{WEDDING.family.groomFather} · {WEDDING.family.groomMother}</strong><span>의 아들</span><b>{WEDDING.groom}</b></p>
            <p><strong>{WEDDING.family.brideFather} · {WEDDING.family.brideMother}</strong><span>의 딸</span><b>{WEDDING.bride}</b></p>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.calendarSection}`}>
        <Reveal><SectionTitle eyebrow="SAVE THE DATE" title="우리의 특별한 날" /></Reveal>
        <Reveal delay={.08}>
          <div className={styles.dateSummary}><strong>22</strong><div><p>2026년 9월 22일 화요일</p><span>{WEDDING.time} · {WEDDING.venue}</span></div></div>
        </Reveal>
        <Reveal delay={.14}>
          <div className={styles.calendar}>
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d) => <b key={d}>{d}</b>)}
            {days.map((day, i) => <span key={i} className={day === 22 ? styles.weddingDay : ""}>{day === 22 && <i aria-hidden="true" />}{day}</span>)}
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.locationSection}`}>
        <Reveal><SectionTitle eyebrow="LOCATION" title="오시는 길" /></Reveal>
        <Reveal delay={.08} className={styles.locationCard}>
          <Image src="/images/location.svg" alt="예식장 위치 일러스트" width={900} height={700} />
          <div><h3>{WEDDING.venue}</h3><p>{WEDDING.hall}</p><address>{WEDDING.address}</address></div>
        </Reveal>
        <Reveal delay={.16}><a className={styles.primaryButton} href={WEDDING.mapUrl} target="_blank" rel="noreferrer">카카오맵으로 보기</a></Reveal>
      </section>

      <section className={`${styles.section} ${styles.accountSection}`}>
        <Reveal><SectionTitle eyebrow="WITH LOVE" title="마음 전하실 곳" /></Reveal>
        <Reveal delay={.08}><p className={styles.accountIntro}>참석이 어려우신 분들을 위해<br />축하의 마음을 전하실 곳을 안내드립니다.</p></Reveal>
        <div className={styles.accountList}>
          {WEDDING.accounts.map((account, index) => (
            <Reveal key={account.side} delay={.12 + index * .08}>
              <article className={styles.accountCard}><span>{account.side}</span><strong>{account.bank} {account.number}</strong><p>예금주 {account.holder}</p><CopyButton text={`${account.bank} ${account.number}`} /></article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.rsvpSection}`}>
        <Reveal><SectionTitle eyebrow="RSVP" title="참석 여부를 알려주세요" /></Reveal>
        <Reveal delay={.08}><p>준비에 도움이 될 수 있도록<br />참석 여부와 인원을 알려주시면 감사하겠습니다.</p><button className={styles.primaryButton} onClick={() => alert("다음 단계에서 실제 RSVP 폼을 연결할 예정입니다.")}>참석 여부 전달하기</button></Reveal>
      </section>

      <section className={styles.thanksSection}>
        <motion.div className={styles.thanksArt} initial={reduce ? false : { opacity: 0, scale: 1.06 }} whileInView={reduce ? {} : { opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: 1.4, ease }}>
          <Image src="/images/thank-you.svg" alt="바닷가에 함께 선 가족의 수채화 일러스트" width={900} height={1040} />
        </motion.div>
        <Reveal className={styles.thanksText}><span>THANK YOU</span><h2>저희의 시작을<br />함께 축복해 주세요.</h2><p>귀한 걸음과 따뜻한 마음<br />오래도록 소중히 간직하겠습니다.</p><button className={styles.shareButton} onClick={share}>{shareDone ? "주소 복사 완료" : "초대장 공유하기"}</button></Reveal>
      </section>
    </main>
  );
}
