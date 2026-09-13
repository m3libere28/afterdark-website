const video=document.getElementById('walkthrough');
const status=document.getElementById('video-status');
let chapterRequest=0;
document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',async()=>{
 const request=++chapterRequest;
 document.getElementById('demo').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 document.querySelectorAll('.chapters button').forEach(b=>b.classList.toggle('active',b.dataset.chapter===button.dataset.chapter));
 try{
  if(video.readyState<1){
   await new Promise((resolve,reject)=>{
    const cleanup=()=>{video.removeEventListener('loadedmetadata',ready);video.removeEventListener('error',failed);};
    const ready=()=>{cleanup();resolve();};const failed=()=>{cleanup();reject(new Error('Video unavailable'));};
    video.addEventListener('loadedmetadata',ready,{once:true});video.addEventListener('error',failed,{once:true});
    if(video.networkState!==2)video.load();
   });
  }
  if(request!==chapterRequest)return;
  video.currentTime=Number(button.dataset.chapter);
  await video.play();status.textContent='';
 }catch{status.textContent='Press play on the video to watch this chapter.';}
}));
// Motion illustration: defer loading, honor reduced motion, and pause off screen.
(()=>{const hero=document.getElementById('hero-motion'),toggle=document.getElementById('hero-motion-toggle');if(!hero||!toggle)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');let wanted=!reduced.matches&&!navigator.connection?.saveData,visible=false;hero.muted=true;
const paint=()=>{const playing=!hero.paused;toggle.textContent=playing?'Pause motion':'Play motion';toggle.setAttribute('aria-pressed',String(playing));toggle.setAttribute('aria-label',playing?'Pause hero animation':'Play hero animation');};
const update=async()=>{if(wanted&&visible&&!document.hidden){if(!hero.getAttribute('src'))hero.src=matchMedia("(max-width: 1024px)").matches?hero.dataset.mobileSrc:hero.dataset.src;try{await hero.play();}catch{paint();}}else hero.pause();};
hero.addEventListener('playing',()=>{hero.parentElement.classList.add('motion-ready');paint();});hero.addEventListener('pause',paint);hero.addEventListener('error',()=>{hero.parentElement.classList.remove('motion-ready');toggle.hidden=true;});toggle.addEventListener('click',()=>{wanted=!wanted;update();});reduced.addEventListener('change',()=>{wanted=!reduced.matches;update();});document.addEventListener('visibilitychange',update);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.1}).observe(hero.parentElement);})();

// Only one audible demonstration at a time.
const audibleDemos=[document.getElementById('highlight-video'),document.getElementById('walkthrough')].filter(Boolean);audibleDemos.forEach(current=>current.addEventListener('play',()=>audibleDemos.forEach(other=>{if(other!==current)other.pause();})));

