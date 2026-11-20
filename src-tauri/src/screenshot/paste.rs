//! Native Ctrl+V into the Gemini window (last-resort fallback for attaching a screenshot).

/// Press Ctrl+V – but only while our main window is the foreground window, so the keystroke can
/// never land in another application. Returns whether the keys were sent.
#[cfg(windows)]
pub fn ctrl_v_into(app: &tauri::AppHandle) -> bool {
    use windows::Win32::UI::Input::KeyboardAndMouse::{
        SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYBD_EVENT_FLAGS, KEYEVENTF_KEYUP, VIRTUAL_KEY, VK_CONTROL,
    };
    use windows::Win32::UI::WindowsAndMessaging::GetForegroundWindow;

    let Some(main) = crate::windowing::main_window(app) else { return false };
    let Ok(hwnd) = main.hwnd() else { return false };
    // The window was just shown; give the foreground switch a moment.
    let mut foreground = false;
    for _ in 0..20 {
        if unsafe { GetForegroundWindow() } == hwnd {
            foreground = true;
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(25));
    }
    if !foreground {
        log::warn!("Gemini window is not in the foreground – not sending Ctrl+V");
        return false;
    }
    let key = |vk: VIRTUAL_KEY, flags: KEYBD_EVENT_FLAGS| INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 { ki: KEYBDINPUT { wVk: vk, wScan: 0, dwFlags: flags, time: 0, dwExtraInfo: 0 } },
    };
    let v = VIRTUAL_KEY(b'V' as u16);
    let inputs = [
        key(VK_CONTROL, KEYBD_EVENT_FLAGS(0)),
        key(v, KEYBD_EVENT_FLAGS(0)),
        key(v, KEYEVENTF_KEYUP),
        key(VK_CONTROL, KEYEVENTF_KEYUP),
    ];
    let sent = unsafe { SendInput(&inputs, std::mem::size_of::<INPUT>() as i32) };
    sent as usize == inputs.len()
}

#[cfg(not(windows))]
pub fn ctrl_v_into(_app: &tauri::AppHandle) -> bool {
    false
}
