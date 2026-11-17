# Where plugin parts run and where their signals appear

Own content: the docs describe each component, not the plugin view. Exact page and log names come
from the docs and the developer's deployment. The agent has no instance access, so every signal
below is something to **ask the developer for**.

| Plugin part | Runs in | Triggered by | Signals to ask for |
|---|---|---|---|
| Frontend JS, CSS, HTML | The user's browser, loaded from the plugin bundles fylr serves (`/api/v1/plugin/bundle.js`, `bundle.css`, `bundle.html`) | Opening the web frontend | Browser console (first error, `Plugin "<name>" failed to load`), network tab for the bundle requests, the fylr version |
| Extension | A job in the execserver (service `node`, `python3` or `exec`), started by the fylr API server for a request to the plugin's base URL | An HTTP client calling the endpoint | Response status and headers `X-Execserver-Error`, `X-Fylr-Error-Code`, `X-Fylr-Error`, the response body, receipt, execserver log around the request |
| Callback (`db_pre_save`, `transition_db_pre_save`, collection upload) | A job in the execserver, inside fylr's own API call; pre-save callbacks inside the open save transaction | A save, transition or upload by a user or API client | The error the triggering API call returned (generic error naming the callback, or the plugin's own error code), receipt, execserver log |
| Callback `export`, `export_transport` | A job in the execserver, started from the export processing in the fylr backend | An export run | The export's status and messages, receipt, execserver log |
| File-processing recipe | File jobs in the execserver, driven by the File Worker in the fylr backend; file jobs are retried, plugin callbacks are not | Upload or re-production of a file version | `/inspect` file pages, the receipt of the file job (the `FILE_PRODUCE` event keeps it), execserver log |
| Custom data type updater | A job in the execserver, scheduled by fylr without an acting user | The update schedule | Plugin user configured? Receipt, execserver log, fylr log of the scheduler |

## Logs

- **fylr server log:** API requests, job creation, plugin loading, configuration warnings, the
  startup log with `startupCheck` warnings.
- **execserver log:** job execution. At level `debug` or `trace` the entry of a failing command
  lists its environment **with values**: secrets. Ask the developer to redact before sending,
  and redact again before quoting.
- The execserver may run in another container or on another host than fylr. Ask which log is
  which.
- STDERR of a plugin program is diagnostics only and never part of the response. Where it shows
  up depends on the deployment; ask for the receipt and the execserver log of the job.

## `/inspect` pages (the developer opens them)

- `/inspect/system/execserver/`: budgets, service footprints, sampled peaks, slots.
- `/inspect/system/topology` (from 6.35): all fylr servers and execservers, running and waiting
  jobs, failures. JSON at `/inspect/system/topology/data`.

## Receipt abort reasons

| Field | Meaning | Typical plugin cause |
|---|---|---|
| `TimedOut` | Wall-clock timeout | Slow external call, loop, waiting on a lock |
| `Stalled` | No progress for the stall time | Program waits silently (blocked read, hung helper) |
| `OutOfMemory` | Memory budget exceeded | Loading whole exports or files into memory |
| `Stopped` | Operational interruption | Restart, drain, cancel; usually not the plugin |
| `PeakMemory` | Highest sampled resident memory (bytes), not an abort | Compare with the budget on `/inspect/system/execserver/` |
