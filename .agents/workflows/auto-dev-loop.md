---
description: 
---

# name: auto-dev-loop
# description: Executes the TDD loop: Plans, creates E2E tests, implements, runs tests in the browser, debugs, and repeats until absolute success.

## STEP 1: PLANNING AND TEST FIRST
- Invoke @project-planner to create the implementation plan ({task-slug}.md).
- Invoke @qa-automation-engineer to write complete E2E tests (Playwright) for the requirements before implementation begins.

## STEP 2: IMPLEMENTATION
- Invoke the necessary specialists (e.g., @frontend-specialist or @backend-specialist) to write the code that makes the tests pass.

## STEP 3: PRACTICAL VERIFICATION (PHASE X)
- Build the application to ensure there are no compilation errors.
- Start the local development server.
- Run the E2E test suite.
- If needed, activate the Browser Subagent to open `http://localhost:5173`, click on the new feature, and check console logs.

## STEP 4: CORRECTION LOOP (DEBUG)
- If any test fails, there are compilation errors, or the Browser Subagent reports visual/console failures:
  1. Invoke @debugger to analyze the stack trace or error logs.
  2. Invoke the appropriate specialist to apply the fix.
  3. RETURN TO STEP 3. Do not stop until 100% of validations pass.

## STEP 5: SUCCESS
- Only when everything passes in practice, mark tasks as completed and inform the user.