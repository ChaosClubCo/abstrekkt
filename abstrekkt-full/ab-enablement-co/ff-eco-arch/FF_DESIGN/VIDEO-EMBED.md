# Mascot Video — Web & App Embed

Optimized, embeddable mascot loop + the accessible pattern for dropping it into web pages and apps.

## Asset (in `video/`)
| File | Spec |
|---|---|
| `mascot.mp4` | H.264/main, 380×564, 24fps, 6.04s loop, **no audio track**, `+faststart`, ~205 KB |
| `mascot-poster.jpg` | 380×564, ~32 KB — shown before play + for reduced-motion users |

Source clip: `grok_video_2026-05-09-03-46-28` (magenta mascot). Re-encoded muted (autoplay requires muted) and trimmed/scaled for web.

## The pattern (why it's built this way)
Autoplay video done responsibly:
- `muted` + `playsinline` → mobile browsers/webviews permit playback
- **No `autoplay` attribute.** JS starts playback only when (a) the visitor hasn't set reduced-motion, and (b) the element is on-screen (IntersectionObserver). Pauses off-screen.
- `poster` shows instantly and **stays** for reduced-motion users — they never see motion.
- `preload="metadata"` keeps the initial payload tiny.

## Web page embed
Copy the `<video>` block + the script from `video-embed.html`:

```html
<video class="mascot-vid" poster="video/mascot-poster.jpg"
       muted loop playsinline preload="metadata"
       aria-label="FlashFusion mascot animation" disablepictureinpicture>
  <source src="video/mascot.mp4" type="video/mp4"/>
</video>
```
```js
(function () {
  var vids = document.querySelectorAll('.mascot-vid'); if (!vids.length) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; // poster stays
  if (!('IntersectionObserver' in window)) { vids.forEach(v => v.play().catch(()=>{})); return; }
  var io = new IntersectionObserver(es => es.forEach(e =>
    e.isIntersecting ? e.target.play().catch(()=>{}) : e.target.pause()), { threshold: 0.25 });
  vids.forEach(v => io.observe(v));
})();
```
Live demo: open `video-embed.html` (verified rendering in `video-embed-playing.png` / `video-embed-reduced.png`).

## App embed (React)
Use `MascotVideo.jsx`:
```jsx
import { MascotVideo } from './MascotVideo';
<MascotVideo mp4="/video/mascot.mp4" poster="/video/mascot-poster.jpg" className="w-72" />
```
Same reduced-motion + in-view guards, with `IntersectionObserver` cleanup on unmount.

## Production delivery via Cloudinary (recommended at scale)
Self-hosting the MP4 is fine for one page. For volume, deliver through Cloudinary's video CDN:
1. Upload `mascot.mp4` to the `dj8gynjnf` cloud (video resource type). *(Not done this session — the upload tool wasn't loaded.)*
2. Deliver adaptive + auto-optimized:
   `https://res.cloudinary.com/dj8gynjnf/video/upload/f_auto,q_auto/<public_id>.mp4`
3. Auto poster from the video: append `so_1.5` (frame at 1.5s) on an image URL:
   `https://res.cloudinary.com/dj8gynjnf/video/upload/so_1.5,f_auto,q_auto/<public_id>.jpg`
4. Suggested taxonomy (matches the image library): folder `FlashFusion/Brand/Mascot`, tag `flashfusion-brand,mascot,video`.

## Content-integrity note — clips NOT prepared
Of the 3 uploaded clips present this session, only the mascot was embedded.
- `grok_video_…45-43` ("Unleash the Cosmos") — **excluded.** Retired cosmic aesthetic + off the champion-model positioning; embedding it in FlashFusion properties would reintroduce branding the project rules retire.
- `grok_video_…46-14` (teal ambient loop) — **excluded.** Generic; the tuned `bg-engine.js` already owns ambient motion.

If you want either prepared for a *different* property/lane, say which — I won't put them on FlashFusion surfaces by default.
