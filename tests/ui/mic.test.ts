import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { find } from "../../src/bridge/dom";
import {
  installEscapeWatch,
  installMicTracker,
  isRecording,
  liveAudioTracks,
  micButton,
  micStart,
  micStop,
  takeText,
  voiceStatus,
} from "../../src/bridge/mic";

const fixture = (name: string) => readFileSync(resolve(import.meta.dirname, "fixtures", name), "utf-8");

/** Minimal stand-in for a microphone MediaStreamTrack. */
class FakeTrack extends EventTarget {
  readyState: "live" | "ended" = "live";
  stop() {
    this.readyState = "ended";
    this.dispatchEvent(new Event("ended"));
  }
}

let tracks: FakeTrack[] = [];

/** Fake getUserMedia + a Gemini-like mic button: click starts/stops "listening". */
function setupGeminiMic(opts: { failsToStart?: boolean; transcript?: string[] } = {}) {
  (window as any).__gtAudioTracks = undefined;
  const md: any = {
    getUserMedia: async () => {
      const t = new FakeTrack();
      tracks.push(t);
      return { getAudioTracks: () => [t] };
    },
  };
  Object.defineProperty(window.navigator, "mediaDevices", { value: md, configurable: true });
  installMicTracker(window);
  const button = micButton(document)!;
  button.addEventListener("click", async () => {
    const live = tracks.find((t) => t.readyState === "live");
    if (live) {
      live.stop();
      // Gemini writes the final words shortly after stopping.
      for (const [i, words] of (opts.transcript ?? []).entries()) {
        setTimeout(() => {
          const p = document.createElement("p");
          p.textContent = words;
          find(document, "editor")!.appendChild(p);
        }, 100 * (i + 1));
      }
    } else if (!opts.failsToStart) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }
  });
  return button;
}

beforeEach(() => {
  document.body.innerHTML = fixture("gemini-input-empty.html");
  tracks = [];
});

describe("Gemini microphone", () => {
  it("finds Gemini's mic button on the real page structure", () => {
    expect(micButton(document)?.getAttribute("aria-label")).toBe("Spracheingabe (^⇧D)");
  });

  it("tracks live microphone tracks opened via getUserMedia", async () => {
    setupGeminiMic();
    expect(liveAudioTracks(window)).toBe(0);
    await navigator.mediaDevices.getUserMedia({ audio: true });
    expect(liveAudioTracks(window)).toBe(1);
    tracks[0].stop();
    expect(liveAudioTracks(window)).toBe(0);
  });

  it("starts listening and reports recording", async () => {
    setupGeminiMic();
    await micStart(document, 1000);
    expect(isRecording(document)).toBe(true);
  });

  it("does not click again when already recording", async () => {
    setupGeminiMic();
    await micStart(document, 1000);
    await micStart(document, 1000);
    expect(tracks).toHaveLength(1);
    expect(isRecording(document)).toBe(true);
  });

  it("fails clearly when Gemini does not start listening (blocked microphone)", async () => {
    setupGeminiMic({ failsToStart: true });
    await expect(micStart(document, 300)).rejects.toMatchObject({ code: "mic_not_started" });
  });

  it("stops listening and waits for the final transcript", async () => {
    setupGeminiMic({ transcript: ["Hallo", "Welt"] });
    await micStart(document, 1000);
    const text = await micStop(document, 400, 3000);
    expect(isRecording(document)).toBe(false);
    expect(text.replace(/\s+/g, " ")).toBe("Hallo Welt");
  });

  it("also treats a pressed mic toggle as recording (secondary signal)", () => {
    setupGeminiMic();
    micButton(document)!.setAttribute("aria-pressed", "true");
    expect(isRecording(document)).toBe(true);
  });

  it("cuts the prompt text and leaves the editor empty", async () => {
    document.body.innerHTML = fixture("gemini-input-filled.html");
    expect(await takeText(document)).toBe("Hallo Test");
    const editor = find(document, "editor")!;
    expect(editor.textContent).toBe("");
    expect(editor.classList.contains("ql-blank")).toBe(true);
  });

  it("reports an Escape press once (cancel) together with the recording state", async () => {
    setupGeminiMic();
    installEscapeWatch(window);
    await micStart(document, 1000);
    expect(voiceStatus(document)).toEqual({ recording: true, escape: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(voiceStatus(document)).toEqual({ recording: true, escape: true });
    expect(voiceStatus(document).escape).toBe(false);
  });
});
