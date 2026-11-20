import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { attachmentCount, find, insertImage, insertText, selfTest, send } from "../../src/bridge/dom";

const fixture = (name: string) => readFileSync(resolve(import.meta.dirname, "fixtures", name), "utf-8");

function load(name: string) {
  document.body.innerHTML = fixture(name);
}

// jsdom has no DataTransfer/DragEvent – minimal stand-ins, enough for the drop path.
class FakeDataTransfer {
  files: File[] = [];
  items = { add: (f: File) => this.files.push(f) };
}
class FakeClipboardEvent extends Event {
  clipboardData: FakeDataTransfer;
  constructor(type: string, init: EventInit & { clipboardData: FakeDataTransfer }) {
    super(type, init);
    this.clipboardData = init.clipboardData;
  }
}
class FakeDragEvent extends Event {
  dataTransfer: FakeDataTransfer;
  constructor(type: string, init: EventInit & { dataTransfer: FakeDataTransfer }) {
    super(type, init);
    this.dataTransfer = init.dataTransfer;
  }
}

const PNG_1PX =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("Gemini bridge selectors (fixtures from the live page)", () => {
  it("finds editor, drop zone and no send button on an empty prompt", () => {
    load("gemini-input-empty.html");
    expect(find(document, "editor")?.getAttribute("role")).toBe("textbox");
    expect(find(document, "dropZone")?.hasAttribute("xapfileselectordropzone")).toBe(true);
    expect(find(document, "sendButton")).toBeNull();
  });

  it("does not mistake the microphone or menu buttons for the send button", () => {
    load("gemini-input-filled.html");
    expect(find(document, "sendButton")?.getAttribute("aria-label")).toBe("Nachricht senden");
  });

  it("self-test passes on the real structure and reports what is missing otherwise", () => {
    load("gemini-input-empty.html");
    expect(selfTest(document)).toEqual({ ok: true, missing: [] });
    document.body.innerHTML = "<div>Landing page without input</div>";
    expect(selfTest(document)).toEqual({ ok: false, missing: ["editor", "dropZone"] });
  });
});

describe("insertText", () => {
  beforeEach(() => load("gemini-input-empty.html"));

  it("writes multi-line text as paragraphs into an empty editor", async () => {
    await insertText(document, "Erste Zeile\nZweite Zeile");
    const editor = find(document, "editor")!;
    expect([...editor.querySelectorAll("p")].map((p) => p.textContent)).toEqual(["Erste Zeile", "Zweite Zeile"]);
    expect(editor.classList.contains("ql-blank")).toBe(false);
  });

  it("appends to existing text by default", async () => {
    load("gemini-input-filled.html");
    await insertText(document, "Neu");
    const texts = [...find(document, "editor")!.querySelectorAll("p")].map((p) => p.textContent);
    expect(texts).toEqual(["Hallo Test", "Neu"]);
  });

  it("replaces existing text when append is false", async () => {
    load("gemini-input-filled.html");
    await insertText(document, "Ersatz", false);
    expect(find(document, "editor")!.textContent).toBe("Ersatz");
  });

  it("fires an input event so Gemini notices the change", async () => {
    const onInput = vi.fn();
    find(document, "editor")!.addEventListener("input", onInput);
    await insertText(document, "x");
    expect(onInput).toHaveBeenCalled();
  });

  it("fails clearly when the editor is missing", async () => {
    document.body.innerHTML = "<div></div>";
    await expect(insertText(document, "x")).rejects.toMatchObject({ code: "selector_missing", detail: "editor" });
  });
});

describe("send", () => {
  it("clicks the send button", async () => {
    load("gemini-input-filled.html");
    const onClick = vi.fn();
    find(document, "sendButton")!.addEventListener("click", onClick);
    await send(document, 500);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("waits while the button is disabled (upload running)", async () => {
    load("gemini-input-filled.html");
    const button = find(document, "sendButton")!;
    button.setAttribute("aria-disabled", "true");
    const onClick = vi.fn();
    button.addEventListener("click", onClick);
    setTimeout(() => button.setAttribute("aria-disabled", "false"), 250);
    await send(document, 2000);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("times out when there is nothing to send", async () => {
    load("gemini-input-empty.html");
    await expect(send(document, 300)).rejects.toMatchObject({ code: "timeout" });
  });
});

describe("insertImage", () => {
  beforeEach(() => {
    load("gemini-input-empty.html");
    Object.assign(window, { DataTransfer: FakeDataTransfer, DragEvent: FakeDragEvent, ClipboardEvent: FakeClipboardEvent });
  });

  it("drops a PNG file on the drop zone and resolves once a preview appears", async () => {
    const zone = find(document, "dropZone")!;
    const dropped: File[] = [];
    zone.addEventListener("drop", (e) => {
      const files = (e as unknown as FakeDragEvent).dataTransfer.files;
      dropped.push(...files);
      setTimeout(() => zone.prepend(document.createElement("uploader-file-preview")), 100);
    });
    await insertImage(document, PNG_1PX, "shot.png", 2000);
    expect(dropped).toHaveLength(1);
    expect(dropped[0].type).toBe("image/png");
    expect(dropped[0].name).toBe("shot.png");
  });

  it("falls back to a paste event on the editor when the drop shows no preview", async () => {
    const editor = find(document, "editor")!;
    const zone = find(document, "dropZone")!;
    const pasted: File[] = [];
    editor.addEventListener("paste", (e) => {
      pasted.push(...(e as unknown as FakeClipboardEvent).clipboardData.files);
      zone.prepend(document.createElement("uploader-file-preview"));
    });
    await insertImage(document, PNG_1PX, "shot.png", 200);
    expect(pasted).toHaveLength(1);
    expect(pasted[0].type).toBe("image/png");
    expect(attachmentCount(document)).toBe(1);
  });

  it("counts attachment previews in the input area", () => {
    expect(attachmentCount(document)).toBe(0);
    find(document, "dropZone")!.prepend(document.createElement("uploader-file-preview"));
    expect(attachmentCount(document)).toBe(1);
  });

  it("reports not_attached when Gemini shows no preview", async () => {
    await expect(insertImage(document, PNG_1PX, "shot.png", 300)).rejects.toMatchObject({ code: "not_attached" });
  });
});
