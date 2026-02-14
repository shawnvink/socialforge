# Dan Koe YouTube Pipeline Test

**Date:** 2024-12-19
**Model:** Claude Sonnet 4.5
**Platform:** YouTube
**Source:** 1 video transcript ("You Are Learning Slowly")
**Topic:** Productivity systems / 3-Block System

## Pipeline Results

| Step | Time | Tokens | Cost |
|------|------|--------|------|
| P1 Analyze (Voice Profile) | 167.0s | 9,212 | $0.1192 |
| P2 Generate (Script) | 192.7s | 15,242 | $0.1523 |
| P3 Optimize | 185.4s | 23,393 | $0.1750 |
| P4 Validate | ~180s | ~20,000 | ~$0.15 |
| **Total** | **~12 min** | **~68,000** | **~$0.60** |

## Validation Score: 7.3/10 (REVISE)

The "REVISE" verdict is expected -- the P1 analyzer correctly flagged **INSUFFICIENT DATA** (1 video sample vs. 15-30 required). With more source material, scores would improve significantly.

## Output Files

1. [01-voice-profile.md](./01-voice-profile.md) - Full expression profile (6 dimensions)
2. [02-generated-script.md](./02-generated-script.md) - Generated 12-min YouTube script + metadata
3. [03-optimized-script.md](./03-optimized-script.md) - Optimization report (title, thumbnail, hook, retention)
4. [04-validation-report.md](./04-validation-report.md) - Authenticity validation (5 tests + SAP)

## Key Observations

- Voice profile correctly identified Dan Koe's confrontational-diagnostic teaching style
- Generated script captured "So" transition usage, direct address patterns, philosophy-tactics integration
- Optimizer improved hook from 45s to 30s, added retention hooks at drop-off points
- Validator caught voice drift in optimization-added sections (retention hooks slightly elevated vocabulary)
- System properly flagged insufficient data throughout all 4 steps
