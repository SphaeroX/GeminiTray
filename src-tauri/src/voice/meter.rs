//! Peak meter of the default microphone (Windows Core Audio).
//!
//! Reads what arrives at the microphone while Gemini records from it, without opening a second
//! capture stream. COM objects are not `Send`: create and use the meter on one thread.

#[cfg(windows)]
mod imp {
    use windows::Win32::Media::Audio::Endpoints::IAudioMeterInformation;
    use windows::Win32::Media::Audio::{eCapture, eConsole, IMMDeviceEnumerator, MMDeviceEnumerator};
    use windows::Win32::System::Com::{CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED};

    pub struct Meter {
        meter: Option<IAudioMeterInformation>,
        com: bool,
    }

    impl Meter {
        pub fn open() -> Self {
            let com = unsafe { CoInitializeEx(None, COINIT_MULTITHREADED) }.is_ok();
            let meter = unsafe {
                CoCreateInstance::<_, IMMDeviceEnumerator>(&MMDeviceEnumerator, None, CLSCTX_ALL)
                    .and_then(|e| e.GetDefaultAudioEndpoint(eCapture, eConsole))
                    .and_then(|d| d.Activate::<IAudioMeterInformation>(CLSCTX_ALL, None))
            };
            if let Err(e) = &meter {
                log::warn!("microphone meter not available: {e}");
            }
            Self { meter: meter.ok(), com }
        }

        /// Current peak amplitude 0..1 (0 when unavailable).
        pub fn peak(&self) -> f32 {
            self.meter.as_ref().and_then(|m| unsafe { m.GetPeakValue() }.ok()).unwrap_or(0.0)
        }
    }

    impl Drop for Meter {
        fn drop(&mut self) {
            self.meter = None;
            if self.com {
                unsafe { CoUninitialize() };
            }
        }
    }
}

#[cfg(not(windows))]
mod imp {
    pub struct Meter;
    impl Meter {
        pub fn open() -> Self {
            Meter
        }
        pub fn peak(&self) -> f32 {
            0.0
        }
    }
}

pub use imp::Meter;
