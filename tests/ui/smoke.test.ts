import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SettingRow from "../../src/components/SettingRow.vue";

describe("UI test setup", () => {
  it("mounts a Vue component", () => {
    const wrapper = mount(SettingRow, { props: { label: "Mikrofon", description: "Beschreibung" } });
    expect(wrapper.text()).toContain("Mikrofon");
  });

  it("shows an error instead of the description", () => {
    const wrapper = mount(SettingRow, { props: { label: "A", description: "ok", error: "belegt" } });
    expect(wrapper.find(".desc.error").text()).toBe("belegt");
  });
});
