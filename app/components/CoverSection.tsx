import Image from "next/image";
import { WEDDING } from "../data/wedding";

type CoverSectionProps = {
  musicOn: boolean;
  onMenuOpen: () => void;
  onMusicToggle: () => void;
  onScroll: () => void;
};

const coverPetals = [
  { left: "9%", delay: "-2s", duration: "16s", size: "8px", drift: "54px" },
  { left: "22%", delay: "-11s", duration: "19s", size: "6px", drift: "-42px" },
  { left: "38%", delay: "-6s", duration: "17s", size: "10px", drift: "61px" },
  { left: "57%", delay: "-14s", duration: "21s", size: "7px", drift: "-55px" },
  { left: "73%", delay: "-4s", duration: "18s", size: "9px", drift: "46px" },
  { left: "88%", delay: "-9s", duration: "20s", size: "6px", drift: "-48px" },
];

export function CoverSection({ musicOn, onMenuOpen, onMusicToggle, onScroll }: CoverSectionProps) {
  return (
    <section id="cover" className="cover panel">
      <Image
        className="cover-art"
        src="/cover-watercolor.png"
        alt="여름 바다와 등대, 산책로에 핀 꽃을 그린 수채화 풍경"
        fill
        priority
        sizes="(max-width: 375px) 100vw, 375px"
      />
      <div className="cover-veil" aria-hidden="true" />

      <button className="cover-menu" type="button" onClick={onMenuOpen} aria-label="메뉴 열기">
        <span /><span /><span />
      </button>
      <button className={`cover-music ${musicOn ? "is-playing" : ""}`} type="button" onClick={onMusicToggle} aria-label={musicOn ? "배경 음악 정지" : "배경 음악 재생"}>
        <span>BGM</span><i aria-hidden="true" />
      </button>

      <div className="cover-petals" aria-hidden="true">
        {coverPetals.map((petal, index) => (
          <i key={index} style={{
            "--petal-left": petal.left,
            "--petal-delay": petal.delay,
            "--petal-duration": petal.duration,
            "--petal-size": petal.size,
            "--petal-drift": petal.drift,
          } as React.CSSProperties} />
        ))}
      </div>

      <div className="cover-copy">
        <small>WEDDING DINNER INVITATION</small>
        <div className="cover-names"><h1>{WEDDING.groom}</h1><span className="cover-heart" aria-hidden="true" /><h1>{WEDDING.bride}</h1></div>
        <time dateTime="2026-08-15T17:00:00+09:00">{WEDDING.dateLabel}</time>
        <p>우리의 새로운 시작에<br />함께해 주세요.</p>
      </div>

      <button className="scroll-button" type="button" onClick={onScroll} aria-label="다음 화면으로 이동">
        <span>Scroll</span><i aria-hidden="true" />
      </button>
    </section>
  );
}
