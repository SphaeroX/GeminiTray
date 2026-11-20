//! WebView2 permission handling for the Gemini webview: the microphone is allowed without a prompt
//! (Gemini's voice input is how dictation and voice messages work). Everything else keeps the
//! WebView2 default.

#[cfg(windows)]
pub fn allow_microphone(webview: &tauri::Webview) {
    let result = webview.with_webview(|wv| unsafe {
        use webview2_com::Microsoft::Web::WebView2::Win32::{
            COREWEBVIEW2_PERMISSION_KIND, COREWEBVIEW2_PERMISSION_KIND_MICROPHONE, COREWEBVIEW2_PERMISSION_STATE_ALLOW,
        };
        use webview2_com::PermissionRequestedEventHandler;

        let Ok(core) = wv.controller().CoreWebView2() else {
            log::error!("WebView2 core not available – microphone permission handler not installed");
            return;
        };
        let handler = PermissionRequestedEventHandler::create(Box::new(|_sender, args| {
            if let Some(args) = args {
                let mut kind = COREWEBVIEW2_PERMISSION_KIND::default();
                args.PermissionKind(&mut kind)?;
                if kind == COREWEBVIEW2_PERMISSION_KIND_MICROPHONE {
                    args.SetState(COREWEBVIEW2_PERMISSION_STATE_ALLOW)?;
                }
            }
            Ok(())
        }));
        let mut token = 0i64;
        if let Err(e) = core.add_PermissionRequested(&handler, &mut token) {
            log::error!("could not install microphone permission handler: {e}");
        }
    });
    if let Err(e) = result {
        log::error!("with_webview failed: {e}");
    }
}

#[cfg(not(windows))]
pub fn allow_microphone(_webview: &tauri::Webview) {}
