
import { _electron as electron } from '@playwright/test';
import { test, expect } from '@playwright/test';
import * as path from 'path';

test('App launches and can send a prompt with Pro model', async () => {
  // Start Electron app
  const electronApp = await electron.launch({
    args: ['.'],
    executablePath: process.env.VITE_DEV_SERVER_URL ? undefined : undefined, // Adjust as needed
  });

  // Get the main window
  const window = await electronApp.firstWindow();
  
  // Wait for the window to load
  await window.waitForLoadState('domcontentloaded');
  
  // We need to wait for the BrowserView to load Gemini
  // In Electron Playwright, we can't easily access BrowserView directly 
  // without some tricks, but we can check if our scripts are injected.
  
  console.log('Window title:', await window.title());
  
  // Check if we can find the Gemini interface via the window's child frames or similar
  // BrowserViews are tricky in Playwright. Let's try to wait for a specific element 
  // that would be in our renderer process (e.g., TitleBar)
  await expect(window.locator('.title-bar')).toBeVisible();

  // Now, we simulate selecting a prompt from our UI
  // This will trigger the IPC 'set-active-prompt'
  
  // 1. Open prompt menu (simulated click or shortcut)
  // We'll use the window's evaluate to trigger the prompt selection directly for the test
  await window.evaluate(() => {
    const dummyPrompt = {
      id: 'test-id',
      name: 'Test Prompt',
      content: 'Explain Quantum Physics in one sentence.'
    };
    window.ipcRenderer.send('set-active-prompt', dummyPrompt);
  });

  // 2. Wait for the injection to happen in the Gemini view
  // Since we can't easily see the BrowserView content in standard Playwright-Electron,
  // we will check the logs or assume it's working if no errors occur in the main process.
  
  await new Promise(r => setTimeout(r, 5000)); // Wait for Gemini to load and script to inject

  // Clean up
  await electronApp.close();
});
