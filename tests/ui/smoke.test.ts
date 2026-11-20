import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SettingsApp from "../../src/pages/settings/App.vue";

describe("UI test setup", () => {
  it("mounts a Vue page", () => {
    const wrapper = mount(SettingsApp);
    expect(wrapper.find("h1").exists()).toBe(true);
  });
});
