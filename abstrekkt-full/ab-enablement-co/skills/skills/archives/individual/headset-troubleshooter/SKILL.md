---
name: headset-troubleshooter
description: Interactive step-by-step troubleshooting guide for Windows headset auto-switch and detection issues. Use this skill whenever a user mentions headset not working, audio not switching, headset not detected, no sound from headset, microphone not recognized, headset issues after plugging in, or any Windows audio device problem. Adapts automatically for end users (self-service) or L1 support techs (full escalation path including VSA and PowerShell). Always use this skill for headset or audio device complaints — even if the user phrases it casually like "my headset stopped working" or "Teams can't find my mic."
---

# Headset Auto-Switch Troubleshooter

Interactive, step-by-step guided resolution for Windows headset detection and audio-switching failures.

---

## Step 0 — Identify Role and Triage

**Before anything else, ask:**

> "Are you an INT Support Tech working a ticket, or are you the user experiencing the issue?"

- If **End User** → follow [End User Path](#end-user-path)
- If **L1 Tech** → follow [L1 Tech Path](#l1-tech-path)
- If ambiguous → ask one clarifying question: "Are you the person whose headset isn't working, or are you IT helping someone?"

Then ask the user to briefly describe their symptom to route correctly:

| Symptom | Most Likely Phase |
|---|---|
| Headset not detected at all | Start at Step 1 |
| Headset detected but no sound | Start at Step 1.3 (Exclusive Mode) |
| Audio not auto-switching when plugged in | Start at Step 1.1 (Default Device) |
| Worked before, broke after update | Start at Step 1.2 (Drivers) |
| Already tried basic steps | Start at Step 1.4 (Service Restart) |

---

## End User Path

> 💡 TIP: Step 4 (Restart Audio Services) fixes most issues without a reboot. If you're in a hurry, try that first.

Walk the user through **one step at a time**. After each step, ask:
> "Did that fix it? (yes / no / not sure)"

- **Yes** → Confirm resolved. Log fix if in a ticket context.
- **No** → Move to next step.
- **Not sure** → Describe what to look for, then ask again.

---

### EU Step 1 — Quick Checks (60 seconds)

> "Before we dig in, let's rule out the obvious. Can you check these quickly?"

1. Headset cable is fully plugged in (USB or 3.5mm — firm, no wiggle)
2. If USB: try a different USB port on the laptop
3. If Bluetooth: headset is powered on and paired (shows in Bluetooth devices)
4. Close and reopen the app using audio (Teams, Zoom, browser)

**After each item:** "Done? Did Windows detect the headset now?"

---

### EU Step 2 — Set Headset as Default Device

> "Windows sometimes doesn't auto-switch. Let's manually set your headset as the default."

1. Right-click the **speaker icon** in the bottom-right taskbar corner
2. Click **Sound settings**
3. Under **Output**, click the dropdown → select your headset name
4. Under **Input**, click the dropdown → select your headset microphone
5. Play a short audio clip to test

**Confirm:** "Do you hear sound through the headset now?"

---

### EU Step 3 — Restart Windows Audio (No Reboot Needed)

> "We're going to restart the Windows sound system. Takes under 30 seconds."

> ⚠️ You may hear a brief pop or silence. This is normal. Any active audio will pause momentarily.

1. Press **Windows + R** → type `services.msc` → press Enter
2. Scroll down to **Windows Audio** → right-click → **Restart**
3. Find **Windows Audio Endpoint Builder** → right-click → **Restart**
4. Unplug and replug the headset
5. Check Sound settings — headset should appear under Output and Input

**Confirm:** "Is the headset showing up now?"

---

### EU Step 4 — Disable Exclusive Mode

> "Some apps like Teams or Zoom take full control of audio. Let's turn that off."

1. Press **Windows + R** → type `control` → press Enter
2. Click **Sound** → **Playback** tab
3. Click your headset → click **Properties**
4. Click the **Advanced** tab
5. Uncheck **"Allow applications to take exclusive control of this device"**
6. Click **Apply → OK**
7. Test audio again

**Confirm:** "Any change?"

---

### EU Step 5 — Update Audio Driver

> "An outdated driver can block detection. Let's check for updates."

1. Press **Windows + X** → click **Device Manager**
2. Expand **Sound, video and game controllers**
3. Right-click your headset → **Update driver**
4. Select **Search automatically for drivers**
5. Follow prompts. Restart if asked.
6. Repeat for the built-in audio device

**Confirm:** "Did the update find anything? Is it working now?"

---

### EU Escalation Gate

If all 5 steps fail, say:

> "You've completed all self-help steps. The next step requires IT support. Please [submit a Help Desk ticket](https://helpdesk.intinc.com) or contact helpdesk@intinc.com. Reference what you've already tried so the tech can skip ahead."

Do **not** guide end users into registry edits, driver uninstalls, or admin-level changes.

---

## L1 Tech Path

Walk the tech through **one phase at a time**. Confirm Phase 1 was attempted before moving to Phase 2.

---

### Root Cause Reference

| Cause | Likelihood | Check Order |
|---|---|---|
| Audio Service Stuck | HIGH | First |
| Default Device Not Set | MEDIUM | Second |
| Driver Corruption | MEDIUM | Third |
| Exclusive Mode Lock | MEDIUM | Fourth |
| Hardware / Port Fault | LOW | Last |

---

### Phase 1 — End-User Self-Help (Remote Guidance)

Guide the user through the EU Path above remotely. After each step, confirm with the user whether the issue is resolved.

> ⓘ Complete all Phase 1 steps before escalating. Document what was attempted.

**Escalation Gate — ask before Phase 2:**

> "Has the user confirmed that all Phase 1 steps failed to resolve the issue?"

- **Yes** → Proceed to Phase 2
- **No** → Return to Phase 1 and continue

---

### Phase 2 — L1 Remote Service Restart (VSA)

> ⓘ This phase resolves 60–70% of escalated headset issues. Always attempt before driver reinstallation.

#### Step 2.1 — Verify Remote Access

Confirm all prerequisites before connecting:

- [ ] VSA agent installed — endpoint shows **Online**
- [ ] MFA and remote control permissions are active
- [ ] User is available and seated at their computer

**Ask:** "Is the endpoint reachable in VSA and the user ready?"

---

#### Step 2.2 — Run Service Restart Script

Deploy via VSA Agent Procedures **or** run directly in an elevated PowerShell session:

```powershell
# Headset Detection Fix — Audio Service Restart
# Run as Administrator

Stop-Service -Name "Audiosrv" -Force
Start-Service -Name "Audiosrv"

Stop-Service -Name "AudioEndpointBuilder" -Force
Start-Service -Name "AudioEndpointBuilder"

# Force device rescan
pnputil /scan-devices

Write-Host "Audio services restarted. Ask user to replug headset."
```

After running: ask the user to unplug and replug the headset.

**Confirm:** "Is the headset now detected in Sound settings?"

---

#### Step 2.3 — Verify Resolution

Confirm with the user:
- Headset appears under **Output** and **Input** in Sound settings
- Audio plays through the headset
- Microphone is recognized by Teams/Zoom (if applicable)

If resolved → document fix in ticket and close.

---

### Phase 3 — Driver Reinstallation (Escalate if Needed)

If Phase 2 does not resolve:

1. In Device Manager → right-click headset → **Uninstall device** (check "Delete driver software")
2. Restart the endpoint
3. Windows will reinstall the driver on next boot
4. If still failing → escalate to L2 with full notes: what was tried, VSA session ID, error messages observed

> ⚠️ Do not attempt registry edits without L2 authorization.

---

## Resolution Logging (L1 Only)

When closing a ticket, confirm the following were documented:
- Phase(s) attempted
- Step that resolved the issue
- Any scripts run (include VSA procedure name or confirm PowerShell was used)
- Whether escalation to L2 was required

---

## Quick Reference

| Resource | Link |
|---|---|
| Microsoft Audio Fix Docs | https://support.microsoft.com/windows/fix-sound-problems |
| Kaseya VSA Agent Procedures | Internal VSA portal |
| Freshservice Ticket Portal | https://helpdesk.intinc.com |
| INT Help Desk Email | helpdesk@intinc.com |
