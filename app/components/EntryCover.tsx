import Image from "next/image";
import { WEDDING } from "../data/wedding";
import coverArtwork from "../../public/cover-watercolor.webp";

type EntryCoverProps = {
  isLeaving: boolean;
  onEnter: () => void;
};

const entryPetals = [
  { left: "13%", delay: "-3s", duration: "20s", drift: "42px", size: "7px" },
  { left: "35%", delay: "-12s", duration: "23s", drift: "-48px", size: "9px" },
  { left: "66%", delay: "-7s", duration: "21s", drift: "52px", size: "6px" },
  { left: "86%", delay: "-16s", duration: "24s", drift: "-38px", size: "8px" },
];

export function EntryCover({ isLeaving, onEnter }: EntryCoverProps) {
  return (
    <section className={`entry-cover ${isLeaving ? "is-leaving" : ""}`} aria-label="청첩장 입장 화면">
      <Image
        className="entry-art"
        src={coverArtwork}
        alt="하늘과 바다, 꽃길과 등대가 보이는 수채화 풍경"
        fill
        preload
        quality={85}
        sizes="(max-width: 375px) 100vw, 375px"
      />
      <div className="entry-petals" aria-hidden="true">
        {entryPetals.map((petal, index) => (
          <i key={index} style={{
            "--entry-left": petal.left,
            "--entry-delay": petal.delay,
            "--entry-duration": petal.duration,
            "--entry-drift": petal.drift,
            "--entry-size": petal.size,
          } as React.CSSProperties} />
        ))}
      </div>

      <div className="entry-copy">
        <small>WEDDING DINNER INVITATION</small>
        <h1><span>{WEDDING.groom}</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.51Z" /></svg><span>{WEDDING.bride}</span></h1>
        <time dateTime="2026-08-15T17:00:00+09:00">{WEDDING.dateLabel}</time>
        <p>우리의 새로운 시작에<br />함께해 주세요.</p>
      </div>

      <button className="entry-button" type="button" onClick={onEnter} disabled={isLeaving}>
        초대장 열기
        <span aria-hidden="true" />
      </button>
      <p className="entry-audio-note">버튼을 누르면 음악이 재생됩니다.</p>
    </section>
  );
}
