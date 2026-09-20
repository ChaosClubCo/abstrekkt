import { useEffect, useRef } from 'react';

/**
 * MascotVideo — FlashFusion mascot loop for apps.
 *
 * Best-practice autoplay video:
 *  - muted + playsInline so mobile browsers/webviews allow autoplay
 *  - NO `autoplay` attribute; we start playback in JS ONLY when:
 *      (a) the user has not requested reduced motion, AND
 *      (b) the element is actually in the viewport (IntersectionObserver)
 *  - poster shows immediately and remains for reduced-motion users
 *  - preload="metadata" keeps initial payload tiny
 *
 * @param {object}  props
 * @param {string}  props.mp4      - required, path/URL to the H.264 MP4
 * @param {string}  props.poster   - required, poster image path/URL
 * @param {string} [props.className]
 * @param {string} [props.label]   - accessible label
 */
export function MascotVideo({ mp4, poster, className = '', label = 'FlashFusion mascot animation' }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Honor reduced-motion: leave the poster, never animate.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    // Play only while visible; pause when scrolled away (battery + CPU).
    if (!('IntersectionObserver' in window)) {
      v.play().catch(() => {}); // autoplay may be blocked; poster remains — acceptable
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (!mp4 || !poster) {
    // Fail loud in dev rather than render a broken element.
    console.error('[MascotVideo] `mp4` and `poster` are required props');
    return null;
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      disablePictureInPicture
    >
      <source src={mp4} type="video/mp4" />
    </video>
  );
}

/* Usage:
   import { MascotVideo } from './MascotVideo';
   <MascotVideo mp4="/video/mascot.mp4" poster="/video/mascot-poster.jpg" className="w-72" />
*/
