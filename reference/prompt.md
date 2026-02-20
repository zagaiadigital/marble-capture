# AGENT DIRECTIVE: ADVANCED CREATE WORKFLOW & PANO INPAINTING STUDIO

You are operating as a Lead Architect in the Google Antigravity environment. Execute this prompt using `thinking_level="high"`.

We are upgrading our "Marble Web Capture" to mimic World Labs' "Advanced Create" workflow. We need to introduce a multi-stage pipeline: Video -> Mini Pano -> Mask/Inpaint Editing -> Plus 3D World.

Please execute the following Feature-Sliced implementation:

### 1. State Machine & Context Update
*   Update `.context/active_task.md` to: "Implement Advanced Create Workflow: Video -> Mini Pano Generation -> Canvas Mask Editor -> InpaintPanoPrompt -> Final Plus Generation".

### 2. API Service Expansion (`src/services/worldLabs.js`)
We need to support multiple generation modes using the `worlds:generate` endpoint. Update `generateWorld` to accept different payloads:

*   **Mode A (Draft Video to Pano):** `model: "Marble 0.1-mini"`, `world_prompt`: `{ type: "video", video_prompt: { source: "media_asset", media_asset_id: assetId } }`.
*   **Mode B (Inpaint Pano):** `model: "Marble 0.1-mini"`, `world_prompt`: `{ type: "inpaint-pano", pano_image: { source: "uri", uri: panoUrl }, pano_mask: { source: "data_base64", data_base64: base64MaskString, extension: "jpg" }, text_prompt: prompt }`. *(Note: Strip the `data:image/jpeg;base64,` prefix from the mask string before sending).*
*   **Mode C (Final Image to 3D):** `model: "Marble 0.1-plus"`, `world_prompt`: `{ type: "image", is_pano: true, image_prompt: { source: "uri", uri: finalPanoUrl } }`.

### 3. The Mask Editor Component (`src/components/MaskCanvas.jsx`)
Create a new isolated React component that allows users to paint a mask over an equirectangular image using a 2D HTML5 `<canvas>`.
*   **Props:** `imageUrl`, `onSaveMask(base64Mask)`, `onCancel()`.
*   **Mechanics:**
    *   Load the `imageUrl` into a background canvas (scaled to fit the screen, but maintain internal resolution of 2560x1280 for output accuracy).
    *   Create a foreground `<canvas>` for drawing the mask.
    *   Brush settings: White color (`#FFFFFF`), opacity 100%, thick brush size (e.g., 40px). 
    *   The background canvas should be visible so the user knows what they are painting over.
    *   When the user clicks "Save", create a new temporary canvas (2560x1280), fill it completely with Black (`#000000`), draw the user's mask strokes (White) on top of it, and export as `image/jpeg` base64. Return this base64 string via `onSaveMask`.

### 4. Workflow Refactoring (`src/screens/ReviewScreen.jsx`)
Transform this screen into a multi-step Studio:

*   **Step 1 (Extract Draft):** When the video finishes uploading, call `generateWorld` (Mode A). Poll until done, extract `response.assets.imagery.pano_url`.
*   **Step 2 (The Studio View):** 
    *   Once we have `pano_url`, stop polling and show the "360 Studio" UI.
    *   Show the panorama (using a simple `<img>` tag or a lightweight 360 viewer if you prefer, but a flat image is fine for the MVP).
    *   Provide two main buttons: "Edit/Add Furniture (AI)" and "Generate Final 3D World".
*   **Step 3 (Editing Loop):**
    *   If the user clicks "Edit", mount the `MaskCanvas.jsx` taking the full screen.
    *   User paints the area and clicks Save.
    *   Show a text input: "What do you want to add here? (e.g., Custom Wood Cabinets)".
    *   Call `generateWorld` (Mode B) with the `panoUrl`, `mask`, and `prompt`.
    *   Show a "Processing AI Edit..." overlay.
    *   Poll until done. Extract the NEW `pano_url` from the response. Update the Studio View with this new image. The user can repeat this loop indefinitely.
*   **Step 4 (Finalization):**
    *   When the user clicks "Generate Final 3D World", take the current `pano_url`, call `generateWorld` (Mode C).
    *   Show the 5-20 minute progress bar.
    *   Once done, pass the `world_marble_url` to the `ResultScreen`.

**Execute with strict adherence to API schema and React best practices. Ensure the mask generation produces a pure black image with white strokes.**