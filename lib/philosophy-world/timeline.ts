import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, overviewAfter, scenes, type WorldScene } from "@/config/animations/philosophy.config";
import { cameraTransform, fitFrame, sceneFrame, type Viewport } from "./camera";
import { pointOnRoute, route } from "./world";

gsap.registerPlugin(ScrollTrigger);
export interface NarrativeLabel { id: string; time: number; end: number; scene?: WorldScene }
export interface CanvasController {
  timeline: gsap.core.Timeline;
  trigger: ScrollTrigger;
  labels: NarrativeLabel[];
  navigateToLabel: (id: string) => void;
  destroy: () => void;
}
const required = <T extends Element>(root: Element, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing philosophy element: ${selector}`);
  return element;
};

// One GSAP timeline owns every animated property. The painter only projects
// tweened geometry into DOM/SVG; it does not reconstruct motion from progress.
export function createWorldTimeline(stage: HTMLElement, viewport: Viewport): CanvasController {
  const cameraElement = required<HTMLElement>(stage, "[data-camera]");
  const path = required<SVGPathElement>(stage, "[data-route]");
  const replayPath = required<SVGPathElement>(stage, "[data-replay-route]");
  const exitPath = required<SVGPathElement>(stage, "[data-exit-route]");
  const cursorElement = required<SVGRectElement>(stage, "[data-cursor]");
  const question = required<HTMLElement>(stage, "[data-question]");
  const tooltip = required<HTMLElement>(stage, "[data-overview-tooltip]");
  const camera = { ...sceneFrame(scenes[0], viewport), scale: .9 };
  const head = { distance: 0, size: 12, radius: 6, rotation: 0, fill: 1, opacity: 0, exit: 0 };
  const overview = { replayDistance: 0, opacity: 0, tooltip: 0, historyOpacity: 1 };
  const intro = { opacity: 1 };
  const view = scenes.map(scene => ({
    scene, marker: 0, connector: 0, textOpacity: 0, recap: 0,
    button: required<HTMLButtonElement>(stage, `[data-node="${scene.id}"]`),
    markerElement: required<SVGElement>(stage, `[data-marker="${scene.id}"]`),
    connectorElement: required<SVGElement>(stage, `[data-connector="${scene.id}"]`),
    annotationElement: required<HTMLElement>(stage, `[data-annotation="${scene.id}"]`),
    recapElement: required<HTMLElement>(stage, `[data-recap="${scene.id}"]`),
  }));
  const labels: NarrativeLabel[] = [];
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  let time = 0;
  let previous: typeof view[number] | undefined;
  let navigation: gsap.core.Tween | undefined;
  let escaped = false;
  let ready = false;
  const wait = (duration: number) => { tl.to({}, { duration }, time); time += duration; };
  const label = (id: string, duration: number, scene?: WorldScene) => {
    tl.addLabel(id, time);
    labels.push({ id, time, end: time + duration, scene });
    wait(duration);
  };
  // Intro is readable at time zero. The first pixel immediately fades it and
  // starts departure; there is no opening hold or input gate.
  tl.addLabel("intro", 0);
  labels.push({ id: "intro", time: 0, end: 0 });
  tl.to(intro, { opacity: 0, duration: .4 }, 0);

  for (const item of view) {
    const scene = item.scene;
    const start = time;
    tl.addLabel(`travel-${scene.id}`, start);
    const fromDistance = previous ? route.distances[previous.scene.id] : 0;
    const toDistance = route.distances[scene.id];
    const frame = sceneFrame(scene, viewport);
    if (previous) tl.set(head, { opacity: 1 }, start);
    else tl.to(head, { opacity: 1, duration: .15 }, start + .25);
    tl.to(head, { size: 12, radius: 6, rotation: 0, fill: 1, duration: .16 }, start);
    if (previous) {
      tl.to(previous, { textOpacity: 0, duration: .25 }, start + .2);
      tl.to(previous, { connector: 0, duration: .2 }, start + .3);
    }
    // Anticipation, tracking and deceleration use the very same time span
    // as the route head. No camera territory is used for navigation.
    const segmentDistance = toDistance - fromDistance;

    const travel = Math.min(
      motion.travel.maxDuration,
      Math.max(
        motion.travel.minDuration,
        segmentDistance / motion.travel.unitsPerSecond,
      ),
    );
    
    const midpoint = pointOnRoute((fromDistance + toDistance) / 2);
    
    const turn =
      previous && Math.abs(scene.node.y - previous.scene.node.y) > 300
        ? 35
        : 0;
    
    tl.to(
      camera,
      {
        x: midpoint.x,
        y: midpoint.y,
        rotation: turn,
        scale: frame.scale,
        duration: travel * 0.5,
        ease: "power1.inOut",
      },
      start,
    );
    
    tl.to(
      camera,
      {
        ...frame,
        duration: travel * 0.5 + 0.16,
        ease: "power2.out",
      },
      start + travel * 0.5,
    );
    
    tl.to(
      head,
      {
        distance: toDistance,
        duration: travel,
        ease: "power2.out",
      },
      start + 0.16,
    );
    
    time = start + travel;

    tl.addLabel(`arrive-${scene.id}`, time);

    const diamond = scene.kind === "pillar";
    
    tl.to(
      head,
      {
        radius: scene.kind === "endpoint" ? 9 : 0,
        size: 18,
        rotation: diamond ? 45 : 0,
        fill: diamond ? 0 : 1,
        duration: motion.arrival,
      },
      time,
    );
    
    time += motion.arrival;
    
    tl.addLabel(`morph-${scene.id}`, time);
    
    tl.to(
      item,
      {
        connector: 1,
        duration: motion.connector,
      },
      time,
    );
    
    time += motion.connector;
    
    tl.to(
      item,
      {
        textOpacity: 1,
        duration: motion.annotation,
      },
      time,
    );
    
    time += motion.annotation;
    
    tl.set(item, { marker: 1 }, time);
    tl.set(head, { opacity: 0 }, time);
    
    label(scene.id, scene.hold, scene);
    
    previous = item;

    if (scene.id === overviewAfter) {
      const overviewStart = time;
      tl.addLabel("travel-overview", time);
      tl.to(item, { textOpacity: 0, connector: 0, duration: .35 }, time);
      tl.set(head, { radius: 6, size: 12, rotation: 0, fill: 1 }, time + .35);
      tl.to(overview, { tooltip: 1, historyOpacity: .24, duration: .25 }, time);
      tl.to(camera, { ...fitFrame(scenes.slice(0, scenes.indexOf(scene) + 1), viewport), duration: motion.overview, ease: "power2.inOut" }, time);
      tl.set(overview, { opacity: 1 }, time + .35);
      tl.to(overview, { replayDistance: toDistance, duration: motion.overview - .55, ease: "none" }, time + .35);
      // Replay is a layer in THIS timeline. It neither rewinds scroll nor
      // resets the historical route. All its tweens reverse deterministically.
      for (const replayItem of view.slice(0, scenes.indexOf(scene) + 1)) {
        const revealAt = time + .35 + route.distances[replayItem.scene.id] / toDistance * (motion.overview - .55);
        tl.to(replayItem, { marker: .2, duration: .15 }, overviewStart);
        tl.to(replayItem, { marker: 1, recap: 1, connector: 1, duration: .16 }, revealAt);
      }
      time += motion.overview;
      label("overview", motion.overviewHold);
      tl.set(overview, { opacity: 0 }, time);
      tl.to(overview, { tooltip: 0, historyOpacity: 1, duration: .25 }, time);
      for (const replayItem of view.slice(0, scenes.indexOf(scene) + 1)) {
        tl.to(replayItem, { recap: 0, connector: 0, duration: .2 }, time);
      }
    }
  }
  // Keep Universal Design / neutrality / B in their original order after
  // overview. Return to the full composition before the cursor exits.
  tl.addLabel("travel-final-overview", time);
  if (previous) tl.to(previous, { textOpacity: 0, duration: .25 }, time);
  tl.to(camera, { ...fitFrame(scenes, viewport), duration: 1.2, ease: "power2.inOut" }, time);
  for (const item of view) tl.to(item, { recap: 1, connector: 1, duration: .3 }, time + .8);
  time += 1.2;
  label("final-overview", .8);
  tl.addLabel("travel-exit", time);
  tl.set(head, { opacity: 1, radius: 6, size: 12, rotation: 0, fill: 1 }, time);
  // Exit distance is measured against the final viewport, so even wide
  // screens let the cursor leave entirely. Camera receives no more tweens.
  const finalFrame = fitFrame(scenes, viewport);
  const exitLength = Math.max(1000, viewport.width / finalFrame.scale);
  tl.to(head, { exit: exitLength, duration: motion.exit, ease: "power1.in" }, time);
  time += motion.exit;
  label("exit", .15);

  const cancelNavigation = () => { navigation?.kill(); navigation = undefined; };
  const paint = () => {
    const now = tl.time();
    const current = labels.filter(l => now + 1e-6 >= l.time).at(-1);
    const holding = current && now < current.end;
    stage.dataset.phase = holding ? "HOLD" : "TRAVEL";
    stage.dataset.label = current?.id ?? "intro";
    stage.dataset.time = String(now);
    stage.dataset.duration = String(tl.duration());
    cameraElement.style.transform = cameraTransform(camera, viewport);
    question.style.opacity = String(intro.opacity);
    tooltip.style.opacity = String(overview.tooltip);
    path.style.strokeDasharray = String(route.length);
    path.style.strokeDashoffset = String(route.length - head.distance);
    path.style.opacity = String(overview.historyOpacity);
    path.dataset.distance = String(head.distance);
    replayPath.style.strokeDasharray = String(route.length);
    replayPath.style.strokeDashoffset = String(route.length - overview.replayDistance);
    replayPath.style.opacity = String(overview.opacity);
    const at = overview.opacity > 0 ? pointOnRoute(overview.replayDistance) : pointOnRoute(head.distance);
    const x = at.x - head.exit;
    const y = at.y;
    cursorElement.setAttribute("x", String(x - head.size / 2));
    cursorElement.setAttribute("y", String(y - head.size / 2));
    cursorElement.setAttribute("width", String(head.size));
    cursorElement.setAttribute("height", String(head.size));
    cursorElement.setAttribute("rx", String(head.radius));
    cursorElement.setAttribute("transform", `rotate(${head.rotation} ${x} ${y})`);
    cursorElement.style.fillOpacity = String(head.fill);
    cursorElement.style.opacity = String(Math.max(head.opacity, overview.opacity));
    cursorElement.dataset.x = String(x);
    cursorElement.dataset.y = String(y);
    exitPath.setAttribute("d", `M${scenes.at(-1)!.node.x},${y} h${-head.exit}`);
    exitPath.style.opacity = head.exit > 0 ? "1" : "0";
    const radians = camera.rotation * Math.PI / 180;
    for (const item of view) {
      const step = labels.find(l => l.id === item.scene.id);
    
      // During timeline construction, paint() may run before every
      // narrative label has been registered.
      const reached = step
        ? now + 1e-6 >= step.time
        : false;
    
      item.markerElement.style.opacity = String(item.marker);
      item.connectorElement.style.opacity = String(item.connector);
      item.annotationElement.style.opacity = String(item.textOpacity);
      item.recapElement.style.opacity = String(item.recap);
    
      item.annotationElement.dataset.active = String(
        reached &&
        current?.id === item.scene.id &&
        holding
      );
    
      const dx = item.scene.node.x - camera.x;
      const dy = item.scene.node.y - camera.y;
    
      const sx =
        viewport.width / 2 +
        (dx * Math.cos(radians) - dy * Math.sin(radians)) *
          camera.scale;
    
      const sy =
        viewport.height / 2 +
        (dx * Math.sin(radians) + dy * Math.cos(radians)) *
          camera.scale;
    
      item.button.style.transform =
        `translate(${sx - 22}px, ${sy - 22}px)`;
    
      const visible =
        reached &&
        sx > 0 &&
        sy > 0 &&
        sx < viewport.width &&
        sy < viewport.height;
    
      item.button.style.visibility = visible ? "visible" : "hidden";
      item.button.tabIndex = visible ? 0 : -1;
      item.button.disabled = !reached;
      item.button.dataset.reached = String(reached);
    
      item.button.setAttribute(
        "aria-current",
        current?.id === item.scene.id ? "step" : "false",
      );
    }
  };
  tl.eventCallback("onUpdate", paint);
  const publishPositions = () => {
    stage.dataset.labels = JSON.stringify(labels.map(({ id, time, end }) => ({ id, time, end })));
    stage.dataset.scrollStart = String(trigger.start);
    stage.dataset.scrollEnd = String(trigger.end);
    for (const item of view) {
      item.button.dataset.scroll = String(Math.ceil(trigger.labelToScroll(item.scene.id)));
      item.button.dataset.hold = String(tl.labels[item.scene.id]);
      item.button.dataset.arrive = String(tl.labels[`arrive-${item.scene.id}`]);
      item.button.dataset.morph = String(tl.labels[`morph-${item.scene.id}`]);
      item.button.dataset.travel = String(tl.labels[`travel-${item.scene.id}`]);
    }
    paint();
  };
  const trigger = ScrollTrigger.create({ id: "philosophy-world", trigger: stage, animation: tl,
    start: `top ${Math.max(0, window.innerHeight - viewport.height)}px`, end: () => `+=${tl.duration() * motion.pixelsPerUnit}`,
    pin: true, pinSpacing: true, scrub: true, invalidateOnRefresh: false,
    onRefresh: () => { if (ready) publishPositions(); },
    onToggle: self => { if (!self.isActive) { escaped = false; cancelNavigation(); } },
  });
  ready = true;
  publishPositions();
  const navigateToLabel = (id: string) => {
    const destination = labels.find(l => l.id === id);
    if (!destination) return;
    // A button for the currently held node is a no-op. During travel it can
    // still return to that node's exact composition.
    if (tl.time() >= destination.time && tl.time() < destination.end) return;
    cancelNavigation();
    const scroll = { y: window.scrollY };
    navigation = gsap.to(scroll, { y: Math.ceil(trigger.labelToScroll(id)), duration: motion.navigationDuration, ease: "power2.out",
      onUpdate: () => { window.scrollTo({ top: scroll.y, behavior: "instant" }); ScrollTrigger.update(); },
      onComplete: () => { navigation = undefined; },
    });
  };
  const interactive = (target: EventTarget | null) => target instanceof Element &&
    Boolean(target.closest("a,button,input,textarea,select,summary,[contenteditable]:not([contenteditable='false']),[role='button'],[role='textbox'],[role='slider']"));
  const keydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") { cancelNavigation(); escaped = true; return; }
    // Tab also cancels an explicit scroll, without intercepting or moving focus.
    if (event.key === "Tab") { cancelNavigation(); return; }
    const canvasActive = trigger.isActive || (stage.getBoundingClientRect().top >= 0 && stage.getBoundingClientRect().top < viewport.height / 2 && tl.time() === 0);
    if (!canvasActive || escaped || interactive(event.target) || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const forward = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey);
    const backward = event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey);
    if (!forward && !backward) return;
    const epsilon = .003;
    const currentHold = labels.find(l => tl.time() + epsilon >= l.time && tl.time() < l.end);
    const before = currentHold ? currentHold.time : tl.time();
    const destination = forward ? labels.find(l => l.time > tl.time() + epsilon) : labels.filter(l => l.time < before - epsilon).at(-1);
    if (!destination) return; // Boundary keys scroll naturally out of the canvas.
    // We are inside the canvas taking over the key: always suppress the
    // browser's native arrow/space scroll from here, repeat or not, so it
    // never fights the programmatic tween.
    event.preventDefault();
    // A destination is chosen once, on the first physical keydown, and
    // stays fixed for the whole move. OS key-repeat and a navigation
    // already in flight must never retarget or restart the tween.
    if (event.repeat || navigation) return;
    navigateToLabel(destination.id);
  };
  const click = (event: MouseEvent) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("button[data-node]") : null;
    if (button && !button.disabled) navigateToLabel(button.dataset.node!);
  };
  // Trackpad/mouse inertial scrolling keeps dispatching "wheel" for a
  // while after the user's hand has left the device: every native
  // momentum-scroll implementation ticks that decaying tail at (at worst)
  // animation-frame cadence, so it never leaves a gap this long while still
  // in motion. A wheel event that follows a real gap this long is
  // therefore a genuinely new gesture and must reclaim control immediately;
  // one that arrives inside the gap is just the tail of the gesture that
  // brought the user here and must not kill a navigation it didn't ask for.
  let lastWheelAt = 0;
  const wheelSettleGapMs = 120;
  const onWheel = (event: WheelEvent) => {
    const isFreshGesture = event.timeStamp - lastWheelAt > wheelSettleGapMs;
    lastWheelAt = event.timeStamp;
    if (isFreshGesture) cancelNavigation();
  };
  window.addEventListener("keydown", keydown);
  // Native input never drives a tween. These passive listeners only cancel
  // keyboard/click navigation, giving native scrolling immediate priority.
  // touchstart has no momentum-tail equivalent (a fling never re-fires
  // touchstart), so any touch is unambiguously a fresh, deliberate one.
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", cancelNavigation, { passive: true });
  stage.addEventListener("click", click);
  return { timeline: tl, trigger, labels, navigateToLabel,
    destroy: () => {
      cancelNavigation();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", cancelNavigation);
      stage.removeEventListener("click", click);
      trigger.kill(); tl.kill();
    },
  };
}
