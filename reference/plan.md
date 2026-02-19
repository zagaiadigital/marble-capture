# 📁 PROJECT SPECIFICATION: MARBLE WEB CAPTURE (v1.0)

## 1. Executive Summary
Build a mobile-first React web application that mimics the native World Labs capture experience. The app guides users to capture a 360° scene using 8 specific photos (limit of the API's `multi-image` endpoint) and orchestrates the complex API flow to generate a 3D world.

**Core Philosophy:** "Zero-Config, Direct-to-Value". No login system. Ephemeral state. Focus on the capture UX and API robustness.

---

## 2. Technical Architecture & Stack
*   **Framework:** React (Vite) + TypeScript.
*   **Styling:** Tailwind CSS (Mobile-first, Dark Mode default).
*   **State Management:** React `useState` / `useReducer` (Complex state for the capture flow).
*   **Sensors:** `DeviceOrientationEvent` (Compass/Gyro) & `navigator.mediaDevices` (Camera).
*   **Storage:** `sessionStorage` for API Key (security). In-memory `Blob` for captured images.

---

## 3. Detailed Implementation Steps

### PHASE 1: Scaffolding & The "Sensor Engine"
**Goal:** Create a robust hook to handle device orientation, encompassing iOS permission quirks and Desktop debugging.

1.  **`useDeviceOrientation` Hook:**
    *   **iOS 13+ Handling:** Must implement `DeviceMotionEvent.requestPermission()` triggered by a user click button ("Start Capture").
    *   **Data Normalization:** Return `alpha` (0-360 degrees) as the compass heading.
    *   **Desktop Fallback:** If `!window.DeviceOrientationEvent`, inject a visible "Debug Slider" in the UI to manually simulate phone rotation (0-360°) for development testing.

2.  **`useCamera` Hook:**
    *   Constraint: `{ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } }`.
    *   Must expose a method `takePhoto()` that draws the video frame to an invisible `<canvas>` and returns a `Blob` (image/jpeg, quality 0.8). *Crucial: Resize images if > 2K resolution to prevent mobile browser memory crashes.*

### PHASE 2: The Capture UI (The "Video Demo" Mimic)
**Goal:** A gamified UI that forces the user to take perfect shots at 45° intervals.

1.  **State Machine:**
    *   `targets`: `[0, 45, 90, 135, 180, 225, 270, 315]` (Degrees).
    *   `currentTargetIndex`: 0 to 7.
    *   `capturedImages`: Array of `{ blob: Blob, azimuth: number }`.

2.  **The "Compass HUD":**
    *   **Center Reticle:** A circle in the middle of the screen.
    *   **Target Indicator:** A visual "ghost" or dot that moves based on `(targetAngle - currentDeviceAngle)`.
    *   **Logic:**
        *   When `currentDeviceAngle` is within `targetAngle ± 3°`: Change UI color to **Green** (Ready). Enable Shutter Button.
        *   Else: UI color **White/Red**. Disable Shutter Button (or show warning).
    *   **Progress Bar:** Simple linear bar or "1/8" text at the bottom.

3.  **Review Screen (Interim):**
    *   Once 8 photos are taken, show a grid of thumbnails.
    *   "Generate World" button (triggers Phase 3).
    *   "Retake" button (clears state, restarts).

### PHASE 3: The World Labs API Orchestration (Backend Logic on Frontend)
**Goal:** Handle the multi-step async flow without timing out.

**The `uploadAndGenerate` function flow:**

1.  **Step A: Asset Upload (Parallelized with Concurrency Limit)**
    *   Iterate through `capturedImages`.
    *   **Sub-step A1:** Call `POST /media-assets:prepare_upload` per image.
        *   *Body:* `{ file_name: "img_N.jpg", kind: "image", extension: "jpg" }`.
    *   **Sub-step A2:** Receive `upload_url` and `media_asset_id`.
    *   **Sub-step A3:** Perform `PUT` request to `upload_url` with the image `Blob`.
        *   *Headers:* Content-Type: `image/jpeg`. **Important:** Check `docs_worldlabs_api.md` for specific required headers like `x-goog-content-length-range` if returned in `upload_info`.
    *   *Result:* An array of 8 `media_asset_id`s mapped to their `azimuth`.

2.  **Step B: Trigger Generation**
    *   Call `POST /worlds:generate`.
    *   *Headers:* `WLT-Api-Key`.
    *   *Body:*
        ```json
        {
          "world_prompt": {
            "type": "multi-image",
            "reconstruct_images": true,
            "multi_image_prompt": [
              { "azimuth": 0, "content": { "source": "media_asset", "media_asset_id": "ID_FROM_STEP_A" } },
              { "azimuth": 45, "content": { "source": "media_asset", "media_asset_id": "..." } },
              ... (repeat for all 8)
            ],
            "text_prompt": "A 360 capture of a space"
          },
          "model": "Marble 0.1-mini" // Use mini for speed/dev, option to toggle to 'plus'
        }
        ```
    *   *Store:* `operation_id`.

3.  **Step C: Polling Strategy**
    *   Implement a robust polling loop.
    *   Call `GET /operations/{operation_id}` every 5 seconds.
    *   **UI Feedback:** Show specific status messages from `metadata.progress.description` (e.g., "Stitching...", "Generating...").
    *   **Termination:** Stop when `done: true`.

### PHASE 4: Result & Visualization
1.  **Success State:**
    *   Extract `response.assets.imagery.pano_url` from the final Operation object.
    *   **Viewer:** Use a lightweight React 360 viewer (e.g., `@ egjs/view360` or simple three.js sphere) to display the result.
    *   **Action:** "Download Image" button.

---

## 4. Critical API Constraints & "Gotchas"
*   **The 8-Image Rule:** The docs state `reconstruct_images` supports up to 8 images. Do NOT attempt 16. Stick to the 45-degree intervals.
*   **CORS:** The browser *will* block direct API calls if World Labs hasn't enabled CORS for public domains.
    *   *Contingency:* If CORS fails during development, use a local proxy (Vite proxy) or instruct the user to use a "CORS Unblock" extension for testing. For production, this logic usually requires a serverless function, but for this Build Mode prototype, we assume direct calls are permitted or proxied via the AI Studio environment.
*   **Memory:** Mobile browsers aggressively kill tabs using too much RAM. Clean up `Blob` references/URLs immediately after upload.

---

## 5. UI/UX Style Guide
*   **Theme:** "Cyberpunk Utility". Dark greys, bright neon green for "Alignment/Success", bright red for "Error".
*   **Typography:** Monospace for data (angles, IDs), Sans-serif for instructions.
*   **Interaction:** Haptic feedback (vibration) when a photo is taken.