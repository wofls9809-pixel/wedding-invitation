"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const WEDDING = {
  groom: "재린",
  bride: "MJ",
  date: "2026. 09. 22",
  time: "오후 1시",
  venue: "예식장 이름",
  hall: "웨딩홀 · 0층",
  address: "예식장 주소를 입력해 주세요",
  phone: "010-0000-0000",
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

const calendarDays = [
  null, null,
  1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30
];

function Reveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.visible = "true";
          observer.unobserve(element);
        }
      },
      { threshold: 0.14 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.reveal} ${className}`}>
      {children}
    </div>
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
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.prompt("아래 내용을 복사해 주세요.", text);
    }
  }

  return (
    <button className={styles.copyButton} onClick={copy}>
      {done ? "복사 완료" : "계좌 복사"}
    </button>
  );
}

export default function Home() {
  const [musicOn, setMusicOn] = useState(false);
  const [shareDone, setShareDone] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.oscillators.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        audioRef.current.context.close();
      }
    };
  }, []);

  function toggleMusic() {
    if (!musicOn) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = 0.022;
      master.connect(context.destination);

      const notes = [261.63, 329.63, 392.0];
      const oscillators = notes.map((frequency, index) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.48 : 0.25;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        return osc;
      });

      audioRef.current = { context, oscillators };
      setMusicOn(true);
    } else {
      audioRef.current?.oscillators.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      audioRef.current?.context.close();
      audioRef.current = null;
      setMusicOn(false);
    }
  }

  async function share() {
    const data = {
      title: "재린 ♥ MJ 결혼합니다",
      text: "소중한 분들을 저희의 특별한 날에 초대합니다.",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareDone(true);
        setTimeout(() => setShareDone(false), 1600);
      }
    } catch {}
  }

  return (
    <main className={styles.shell}>
      <button
        className={`${styles.musicButton} ${musicOn ? styles.playing : ""}`}
        onClick={toggleMusic}
        aria-label={musicOn ? "배경음 끄기" : "배경음 켜기"}
      >
        {musicOn ? "♫" : "♩"}
      </button>

      <section className={styles.cover}>
        <div className={styles.cloudOne} />
        <div className={styles.cloudTwo} />
        <div className={styles.coverText}>
          <span>WEDDING INVITATION</span>
          <h1>
            {WEDDING.groom}
            <em>and</em>
            {WEDDING.bride}
          </h1>
          <p>{WEDDING.date}</p>
        </div>
        <div className={styles.coverArt}>
          <Image
            src="/images/cover-family.svg"
            alt="여름 바닷가의 신랑, 신부와 아기 수채화 일러스트"
            width={900}
            height={1200}
            priority
          />
        </div>
        <p className={styles.scrollHint}>
          <span />
          SCROLL
        </p>
      </section>

      <section className={`${styles.section} ${styles.familySection}`}>
        <Reveal>
          <SectionTitle eyebrow="OUR FAMILY" title="셋이 맞이하는 첫 번째 여름" />
          <div className={styles.familyArt}>
            <Image
              src="/images/picnic-family.svg"
              alt="바닷가 피크닉을 즐기는 세 가족의 수채화 일러스트"
              width={900}
              height={840}
            />
          </div>
          <p className={styles.poem}>
            둘이 만나 사랑을 배우고,<br />
            작은 기적이 찾아와 셋이 되었습니다.<br />
            가장 따뜻한 계절에<br />
            저희 가족의 첫 장을 열려 합니다.
          </p>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.invitationSection}`}>
        <Reveal>
          <SectionTitle eyebrow="INVITATION" title="소중한 분들을 초대합니다" />
          <div className={styles.letter}>
            {WEDDING.invitation.map((line, index) =>
              line ? <p key={index}>{line}</p> : <br key={index} />
            )}
          </div>

          <div className={styles.parents}>
            <p>
              <strong>{WEDDING.family.groomFather} · {WEDDING.family.groomMother}</strong>
              <span>의 아들</span>
              <b>{WEDDING.groom}</b>
            </p>
            <p>
              <strong>{WEDDING.family.brideFather} · {WEDDING.family.brideMother}</strong>
              <span>의 딸</span>
              <b>{WEDDING.bride}</b>
            </p>
          </div>

          <a className={styles.contactButton} href={`tel:${WEDDING.phone}`}>
            연락하기
          </a>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.calendarSection}`}>
        <Reveal>
          <SectionTitle eyebrow="THE WEDDING DAY" title="2026년 9월" />
          <div className={styles.dateSummary}>
            <strong>22</strong>
            <div>
              <p>화요일 {WEDDING.time}</p>
              <span>{WEDDING.venue} · {WEDDING.hall}</span>
            </div>
          </div>

          <div className={styles.calendar}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <b key={day}>{day}</b>
            ))}
            {calendarDays.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className={day === 22 ? styles.weddingDay : ""}
              >
                {day}
              </span>
            ))}
          </div>
          <p className={styles.dday}>우리의 새로운 시작까지</p>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.locationSection}`}>
        <Reveal>
          <SectionTitle eyebrow="LOCATION" title="오시는 길" />
          <div className={styles.locationCard}>
            <Image
              src="/images/location.svg"
              alt="예식장 위치를 표현한 수채화 지도 일러스트"
              width={900}
              height={520}
            />
            <div>
              <h3>{WEDDING.venue}</h3>
              <p>{WEDDING.hall}</p>
              <span>{WEDDING.address}</span>
            </div>
          </div>

          <a
            className={styles.primaryButton}
            href={WEDDING.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            카카오맵으로 보기
          </a>

          <div className={styles.transport}>
            <article>
              <b>자가용</b>
              <p>내비게이션에 예식장 이름 또는 주소를 검색해 주세요.</p>
            </article>
            <article>
              <b>대중교통</b>
              <p>지하철과 버스 안내 문구를 여기에 입력할 수 있습니다.</p>
            </article>
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.accountSection}`}>
        <Reveal>
          <SectionTitle eyebrow="FOR YOUR HEART" title="마음 전하실 곳" />
          <p className={styles.smallText}>
            참석이 어려우신 분들을 위해<br />
            계좌번호를 안내드립니다.<br />
            너른 마음으로 양해 부탁드립니다.
          </p>

          <div className={styles.accounts}>
            {WEDDING.accounts.map((account) => (
              <details key={account.side}>
                <summary>{account.side} 계좌번호</summary>
                <div>
                  <p>
                    <span>{account.bank}</span>
                    <strong>{account.number}</strong>
                    <small>예금주 {account.holder}</small>
                  </p>
                  <CopyButton text={`${account.bank} ${account.number} ${account.holder}`} />
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      <section className={`${styles.section} ${styles.rsvpSection}`}>
        <Reveal>
          <SectionTitle eyebrow="RSVP" title="참석 여부를 알려주세요" />
          <p className={styles.smallText}>
            정성껏 모실 수 있도록 참석 여부를<br />
            미리 알려주시면 감사하겠습니다.
          </p>

          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              alert("참석 여부가 임시 저장되었습니다. 실제 수집 기능은 다음 단계에서 연결합니다.");
            }}
          >
            <label>
              성함
              <input required placeholder="성함을 입력해 주세요" />
            </label>
            <label>
              참석 여부
              <select required defaultValue="">
                <option value="" disabled>선택해 주세요</option>
                <option>참석합니다</option>
                <option>참석이 어렵습니다</option>
              </select>
            </label>
            <label>
              동반 인원
              <select defaultValue="0명">
                <option>0명</option>
                <option>1명</option>
                <option>2명</option>
                <option>3명 이상</option>
              </select>
            </label>
            <label>
              전하고 싶은 말
              <textarea rows="4" placeholder="축하 메시지를 남겨주세요" />
            </label>
            <button type="submit">참석 여부 전달하기</button>
          </form>
        </Reveal>
      </section>

      <section className={styles.thanksSection}>
        <Reveal>
          <div className={styles.thanksArt}>
            <Image
              src="/images/thank-you.svg"
              alt="노을 진 바닷가를 바라보는 세 가족의 뒷모습 수채화 일러스트"
              width={900}
              height={1040}
            />
          </div>
          <div className={styles.thanksText}>
            <span>THANK YOU</span>
            <h2>함께해 주셔서<br />고맙습니다</h2>
            <p>{WEDDING.groom} · {WEDDING.bride} 올림</p>
            <button onClick={share}>
              {shareDone ? "주소가 복사되었습니다" : "초대장 공유하기"}
            </button>
          </div>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        <p>재린 ♥ MJ</p>
        <span>2026. 09. 22</span>
      </footer>
    </main>
  );
}
