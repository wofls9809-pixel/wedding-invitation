"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const info={groom:"이재린",bride:"조미연",date:"2026. 08. 15",time:"오후 5시",venue:"산하춘",address:"충청북도 청주시 흥덕구 강내면 월탄1길 15-11",groomPhone:"01048229809",bridePhone:"01032510080"};
const accounts=[
 {side:"신랑",name:"이재린",bank:"우리은행",number:"1002-860-492685"},
 {side:"신랑",name:"이재린",bank:"농협",number:"356-1049-8933-03"},
 {side:"신부",name:"조미연",bank:"농협",number:"351-0501-6204-03"},
 {side:"신부",name:"조미연",bank:"카카오뱅크",number:"3333-05-0736895"}
];
const days=[null,null,null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const ease=[.22,1,.36,1];
function Reveal({children,delay=0,className=""}){const reduce=useReducedMotion();return <motion.div className={className} initial={reduce?false:{opacity:0,y:30}} whileInView={reduce?{}:{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:1,delay,ease}}>{children}</motion.div>}
function Title({eyebrow,children}){return <header className={styles.title}><span>{eyebrow}</span><h2>{children}</h2><i>✦</i></header>}
function Modal({open,onClose,children}){if(!open)return null;return <motion.div className={styles.modalBack} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div className={styles.modal} initial={{opacity:0,y:25,scale:.97}} animate={{opacity:1,y:0,scale:1}} onClick={e=>e.stopPropagation()}><button className={styles.close} onClick={onClose}>×</button>{children}</motion.div></motion.div>}
function Copy({text}){const [done,setDone]=useState(false);const copy=async()=>{try{await navigator.clipboard.writeText(text.replaceAll("-",""));setDone(true);setTimeout(()=>setDone(false),1300)}catch{window.prompt("복사해 주세요",text)}};return <button className={styles.tiny} onClick={copy}>{done?"복사 완료":"복사"}</button>}
export default function Home(){
 const hero=useRef(null),audioRef=useRef(null),reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:hero,offset:["start start","end start"]});
 const imageY=useTransform(scrollYProgress,[0,1],[0,65]);
 const [music,setMusic]=useState(false),[contact,setContact]=useState(false),[rsvp,setRsvp]=useState(false),[shareDone,setShareDone]=useState(false);
 const [count,setCount]=useState({d:0,h:0,m:0});
 useEffect(()=>{const tick=()=>{const diff=Math.max(0,new Date("2026-08-15T17:00:00+09:00")-new Date());setCount({d:Math.floor(diff/86400000),h:Math.floor(diff/3600000)%24,m:Math.floor(diff/60000)%60})};tick();const id=setInterval(tick,60000);return()=>clearInterval(id)},[]);
 useEffect(()=>{const start=()=>{if(audioRef.current&&!music){audioRef.current.play().then(()=>setMusic(true)).catch(()=>{})}window.removeEventListener("pointerdown",start)};window.addEventListener("pointerdown",start,{once:true});return()=>window.removeEventListener("pointerdown",start)},[music]);
 const toggleMusic=()=>{if(!audioRef.current)return;music?audioRef.current.pause():audioRef.current.play();setMusic(!music)};
 const share=async()=>{const data={title:"미연 ♥ 재린 웨딩 디너 초대장",text:"2026년 8월 15일 오후 5시, 산하춘에서 만나요.",url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);setShareDone(true);setTimeout(()=>setShareDone(false),1500)}}catch{}};
 const submit=(e)=>{e.preventDefault();const fd=new FormData(e.currentTarget);const body=`[미연 ♥ 재린 웨딩 디너 참석 회신]\n성함: ${fd.get("name")}\n참석 여부: ${fd.get("attendance")}\n인원: ${fd.get("people")}명\n메시지: ${fd.get("message")||"없음"}`;location.href=`sms:${info.groomPhone}?body=${encodeURIComponent(body)}`;setRsvp(false)};
 const mapQuery=encodeURIComponent(`${info.venue} ${info.address}`);
 return <main className={styles.shell}>
  <audio ref={audioRef} src="/music.mp3" loop preload="metadata" />
  <button className={`${styles.music} ${music?styles.playing:""}`} onClick={toggleMusic} aria-label="배경음악 켜기 또는 끄기">♪</button>
  <section ref={hero} className={styles.cover}>
   <motion.div style={reduce?{}:{y:imageY}} className={styles.heroImage}><Image src="/images/cover.jpg" alt="이재린과 조미연 가족 수채화 일러스트" fill priority sizes="460px" /></motion.div>
   <div className={styles.heroShade}/><motion.div className={styles.heroText} initial={reduce?false:{opacity:0,y:24}} animate={reduce?{}:{opacity:1,y:0}} transition={{duration:1.3,ease}}><span>WEDDING DINNER</span><h1>{info.bride}<em>♥</em>{info.groom}</h1><p>{info.date} SAT · 5 PM</p></motion.div><div className={styles.scroll}>SCROLL<span/></div>
  </section>
  <section className={`${styles.section} ${styles.family}`}><Reveal><Title eyebrow="OUR FAMILY">셋이 맞이하는 첫 번째 여름</Title></Reveal><Reveal delay={.08} className={styles.floatArt}><Image src="/images/picnic-family.svg" width={900} height={840} alt="바닷가의 세 가족"/></Reveal><Reveal delay={.15}><p className={styles.poem}>둘이 만나 사랑을 배우고,<br/>작은 기적이 찾아와 셋이 되었습니다.<br/>가장 따뜻한 계절에<br/>저희 가족의 첫 장을 열려 합니다.</p></Reveal></section>
  <section className={`${styles.section} ${styles.invite}`}><Reveal><Title eyebrow="INVITATION">소중한 분들을 초대합니다</Title></Reveal><Reveal delay={.08}><div className={styles.letter}>서로의 일상에 가장 다정한 사람이 되어<br/>이제 한 가족으로 같은 계절을 걸어가려 합니다.<br/><br/>저희의 새로운 시작에 함께하시어<br/>따뜻한 축복을 나누어 주시면 감사하겠습니다.</div></Reveal><Reveal delay={.16}><p className={styles.names}><b>{info.groom}</b><span>그리고</span><b>{info.bride}</b></p><button className={styles.outline} onClick={()=>setContact(true)}>신랑 · 신부에게 연락하기</button></Reveal></section>
  <section className={`${styles.section} ${styles.calendar}`}><Reveal><Title eyebrow="SAVE THE DATE">우리의 특별한 날</Title></Reveal><Reveal><div className={styles.dateBig}><strong>15</strong><div>2026년 8월 15일 토요일<br/><span>{info.time} · {info.venue}</span></div></div></Reveal><Reveal delay={.1}><div className={styles.grid}>{["SUN","MON","TUE","WED","THU","FRI","SAT"].map(x=><b key={x}>{x}</b>)}{days.map((d,i)=><span key={i} className={d===15?styles.day:""}>{d}</span>)}</div></Reveal><Reveal delay={.16}><div className={styles.dday}><span>D-{count.d}</span><p>{count.d}일 {count.h}시간 {count.m}분 후 만나요</p></div></Reveal></section>
  <section className={`${styles.section} ${styles.location}`}><Reveal><Title eyebrow="LOCATION">오시는 길</Title></Reveal><Reveal className={styles.locationCard}><Image src="/images/location.svg" width={900} height={700} alt="산하춘 위치 일러스트"/><h3>{info.venue}</h3><p>{info.address}</p></Reveal><div className={styles.mapButtons}><a href={`https://map.kakao.com/link/search/${mapQuery}`} target="_blank">카카오맵</a><a href={`https://map.naver.com/p/search/${mapQuery}`} target="_blank">네이버지도</a></div></section>
  <section className={`${styles.section} ${styles.account}`}><Reveal><Title eyebrow="WITH LOVE">마음 전하실 곳</Title></Reveal><Reveal><p className={styles.note}>참석이 어려우신 분들을 위해<br/>축하의 마음을 전하실 곳을 안내드립니다.</p></Reveal><div className={styles.accountList}>{accounts.map((a,i)=><Reveal delay={i*.05} key={a.bank+a.number}><article><span>{a.side}측 · {a.bank}</span><strong>{a.number}</strong><p>예금주 {a.name}</p><Copy text={a.number}/></article></Reveal>)}</div></section>
  <section className={`${styles.section} ${styles.rsvp}`}><Reveal><Title eyebrow="RSVP">참석 여부를 알려주세요</Title></Reveal><Reveal><p>정성껏 자리를 준비할 수 있도록<br/>참석 여부와 인원을 알려주시면 감사하겠습니다.</p><button className={styles.primary} onClick={()=>setRsvp(true)}>참석 여부 전달하기</button></Reveal></section>
  <section className={styles.thanks}><Image src="/images/thank-you.svg" fill alt="감사 인사 가족 일러스트" sizes="460px"/><div className={styles.thanksShade}/><Reveal className={styles.thanksText}><span>THANK YOU</span><h2>저희의 시작을<br/>함께 축복해 주세요.</h2><p>귀한 걸음과 따뜻한 마음<br/>오래도록 소중히 간직하겠습니다.</p><button onClick={share}>{shareDone?"주소 복사 완료":"초대장 공유하기"}</button></Reveal></section>
  <Modal open={contact} onClose={()=>setContact(false)}><h3>신랑 · 신부에게 연락하기</h3><div className={styles.contactRow}><b>신랑 이재린</b><a href={`tel:${info.groomPhone}`}>전화</a><a href={`sms:${info.groomPhone}`}>문자</a></div><div className={styles.contactRow}><b>신부 조미연</b><a href={`tel:${info.bridePhone}`}>전화</a><a href={`sms:${info.bridePhone}`}>문자</a></div></Modal>
  <Modal open={rsvp} onClose={()=>setRsvp(false)}><h3>참석 여부 전달</h3><form className={styles.form} onSubmit={submit}><label>성함<input name="name" required placeholder="성함을 입력해 주세요"/></label><label>참석 여부<select name="attendance"><option>참석합니다</option><option>아쉽지만 참석이 어렵습니다</option></select></label><label>참석 인원<input name="people" type="number" min="1" max="20" defaultValue="1" required/></label><label>축하 메시지<textarea name="message" rows="3" placeholder="선택 입력"/></label><button className={styles.primary} type="submit">문자로 전달하기</button></form></Modal>
 </main>
}
