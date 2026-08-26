# Decision Trees

## Onboarding entry
```
Is the user invited to a workspace?
├─ yes → Invited-member branch: skip outcome capture, inherit workspace context,
│         lightweight first-win.
└─ no  → Is the user "just exploring"?
         ├─ yes → Ghost/Sandbox branch: defer compliance, simulated data.
         └─ no  → Standard Outcome-First wizard (capture outcome first).
```

## Compliance gate
```
Does the action touch real deal/portfolio data?
├─ no  → allow (exploration, education sandbox).
└─ yes → kycStatus == verified?
         ├─ yes → allow.
         └─ no  → block + route to KYC; keep user in sandbox meanwhile.
```

## Monetization trigger
```
activationReached == true?
├─ no  → never show upsell.
└─ yes → value moment detected AND outside cool-down?
         ├─ yes → show contextual upgrade offer with ROI statement.
         └─ no  → wait.
```

## Next-best-action (per lifecycle stage)
```
new/onboarding → drive to first win
activated      → seed the habit loop
habitual       → reinforce reward + investment
power_user     → expansion / team / signal marketplace
at_risk        → predictive win-back tied to stated outcome
dormant        → low-frequency reactivation
```
