#!/bin/bash
# Test: Dan Koe Blog Pipeline (P1→P2→P3→P4)
# Tests P3 optimized content/report separation on blog platform

BASE_URL="http://localhost:3000"
OUT_DIR="$(dirname "$0")"
PROVIDER="anthropic"
MODEL="claude-sonnet-4-5-20250929"
PLATFORM="blog"

read -r -d '' SAMPLES << 'SAMPLESEOF'
Most people don't know how to learn because they fry their brain with podcasts and YouTube videos and books and textbooks and social media. And six months later, after learning so much, they have nothing to show for it. Why are you even learning in the first place if not to do something with it? Learning for most people has become a form of mental masturbation. It's the same cheap dopamine you get from scrolling on your phone, but even worse because it makes you feel as if you're learning something. But the reality is, you'll forget about it by tomorrow. Now here's the harsh truth — you're learning slow, and if you can learn ten times faster, you can achieve success faster. You can complete the portfolio project. You can start the business. You can articulate your thoughts in your writing or whatever it is that you're learning even further. It's my belief that most people are just wasting time. You can probably learn what you need to learn within two weeks, when most people take six months to learn that one thing. So to do that, you need to learn how to learn.

---

When I want to learn something new, I don't start learning. First, I outline a project first, then I learn exactly what I need and build out the project while learning. I found that this solidifies teachings into my brain much faster. The mark of a free person is that they learn how to learn. That is the meta skill — the skill of all skills. In order to pick up a skill that changes your life, you need to know how to learn that skill effectively so that you can use it. Because if you don't choose what to learn, you'll be told what to learn. And if your mind is the operating system for reality, the options available for your future will be drastically limited and you won't even realize it. More importantly, the most important thing you can do when the world is rapidly changing like it is with technology and AI is learn. Learning is the single most important skill because it allows you to learn the skills that can't be taught in schools.

---

The best way to learn is to build a real world project and only search for information when you need it. How much you learn is directly correlated with how much progress you make on the project. When you watch endless tutorials, you fill your mind with noise and chaos. Most of that information goes to waste. It leads to overwhelm, anxiety, and slows down how fast you learn. When it comes time to build the project — the only reason you're learning in the first place — you feel as if you learned nothing and have to search for the information anyway. So if you want to learn faster, skip the tutorial phase. Outline the project first.

---

Learning comes from struggle, not memorization. If you know nothing, at least try to take the first step. Download the software and start playing around. Try to create something, anything. Just get your mind in a state where it's hungry to learn. Otherwise you probably won't digest the information you search for. Then follow this process: You start. Then you don't know what to do. You try and fail. You search for the answer or ask AI. You try to implement the answer. You repeat until the project is complete.

---

Writing is how you systematically reflect on what you learn. When you teach what you learn, you expose more knowledge gaps. You struggle more to understand. You have more specific knowledge to research. The Feynman Technique is about deeply understanding a concept by explaining it in simple terms as if you were teaching it to someone with no prior knowledge. This overlaps with the Protege effect — the teacher learns more than the student. Teaching what you know or what you learn encourages you to make sense of it in your own way.

---

Here's what I recommend for starting: write a newsletter once a week to summarize what you've learned and remember. Teach it to them. Teach what you're learning. This is how so many people start newsletters or on social media — they just use it as a place to share what they're learning that week. Write posts on X, Threads, or LinkedIn, because these are writing platforms. Talk about your opinions, beliefs, personal experiences, and what you are learning and building.

---

Personally, writing changed my life. I was once a freelance web designer who failed at every business prior to that, and I started on social media because I was tired of doing cold outreach to land freelance clients. And as I kept going, I realized the power of writing in terms of getting in front of more people. Every time I hit post, it felt like I had learned something new. The more that I wrote, the more good things happened internally and externally.

---

Stop trying to find your passion. Get good at something valuable. Passion follows mastery, not the other way around. You don't need more time. You need more focus. Most people have 16 waking hours and waste 12 of them doing things that don't matter. The difference between amateurs and pros: amateurs wait for motivation. Pros show up and do the work regardless.

---

You are one skill away from changing your life. Not one opportunity. Not one connection. One skill. Go acquire it. Nobody is going to give you the time to learn and build what you want to learn and build. You have to take the time. Put it on your calendar. Wake up an hour earlier or stay up an hour later. Turn it into a ritual. Grab your coffee, pull up your outline, put on some focus music and start paving the way towards the future you want to create.

---

People choose something to learn, but it doesn't connect to any of their current skills, and it doesn't connect to the life they want to live. This is dangerous. You won't want to learn if there is no deeper meaning or clarity behind it. You will need more discipline and you'll probably continue to hate learning like you did in school. Create an aim for your learning. That way, you can feel the progress you're making toward your self-generated goals, not the goals society assigned to you.
SAMPLESEOF

echo "=== Dan Koe Blog Pipeline Test (P3 Content/Report Separation) ==="
echo "Started: $(date)"
echo ""

call_llm() {
  local system_prompt="$1"
  local user_prompt="$2"
  local step_name="$3"

  echo "Running $step_name..."
  START=$(date +%s)

  RESPONSE=$(curl -s -X POST "$BASE_URL/api/llm" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg provider "$PROVIDER" \
      --arg model "$MODEL" \
      --arg systemPrompt "$system_prompt" \
      --arg userPrompt "$user_prompt" \
      '{provider: $provider, model: $model, systemPrompt: $systemPrompt, userPrompt: $userPrompt, maxTokens: 8192, stream: false}'
    )")

  END=$(date +%s)
  ELAPSED=$((END - START))

  CONTENT=$(echo "$RESPONSE" | jq -r '.content // empty')
  TOKENS_P=$(echo "$RESPONSE" | jq -r '.promptTokens // 0')
  TOKENS_C=$(echo "$RESPONSE" | jq -r '.completionTokens // 0')
  COST=$(echo "$RESPONSE" | jq -r '.cost // 0')

  if [ -z "$CONTENT" ]; then
    echo "ERROR: No content returned for $step_name"
    echo "$RESPONSE" | jq .
    exit 1
  fi

  echo "  Done in ${ELAPSED}s | Tokens: $((TOKENS_P + TOKENS_C)) | Cost: \$${COST}"
  echo ""

  STEP_CONTENT="$CONTENT"
  STEP_TOKENS_P="$TOKENS_P"
  STEP_TOKENS_C="$TOKENS_C"
  STEP_COST="$COST"
  STEP_TIME="$ELAPSED"
}

# ===== P1: ANALYZE =====
SYSTEM_P1=$(curl -s "$BASE_URL/api/prompts?platform=$PLATFORM&step=analyzer" | jq -r '.prompt')
USER_P1="Creator Name: Dan Koe

Content Samples:
$SAMPLES"

call_llm "$SYSTEM_P1" "$USER_P1" "P1 Analyze"
VOICE_PROFILE="$STEP_CONTENT"
P1_TIME="$STEP_TIME"; P1_TOKENS="$((STEP_TOKENS_P + STEP_TOKENS_C))"; P1_COST="$STEP_COST"
echo "$VOICE_PROFILE" > "$OUT_DIR/01-voice-profile.md"
echo "Saved 01-voice-profile.md"

# ===== P2: GENERATE =====
SYSTEM_P2=$(curl -s "$BASE_URL/api/prompts?platform=$PLATFORM&step=generator" | jq -r '.prompt')
USER_P2="Expression Profile:
$VOICE_PROFILE

Topic: Why most people waste 6 months learning what could take 2 weeks — and a 5-step system to learn 10x faster
Content Type: blog_post"

call_llm "$SYSTEM_P2" "$USER_P2" "P2 Generate"
GENERATED="$STEP_CONTENT"
P2_TIME="$STEP_TIME"; P2_TOKENS="$((STEP_TOKENS_P + STEP_TOKENS_C))"; P2_COST="$STEP_COST"
echo "$GENERATED" > "$OUT_DIR/02-generated-blog.md"
echo "Saved 02-generated-blog.md"

# ===== P3: OPTIMIZE =====
SYSTEM_P3=$(curl -s "$BASE_URL/api/prompts?platform=$PLATFORM&step=optimizer" | jq -r '.prompt')
USER_P3="Expression Profile:
$VOICE_PROFILE

Content to Optimize:
$GENERATED"

call_llm "$SYSTEM_P3" "$USER_P3" "P3 Optimize"
RAW_P3="$STEP_CONTENT"
P3_TIME="$STEP_TIME"; P3_TOKENS="$((STEP_TOKENS_P + STEP_TOKENS_C))"; P3_COST="$STEP_COST"
echo "$RAW_P3" > "$OUT_DIR/03-p3-raw-output.md"
echo "Saved 03-p3-raw-output.md"

# Parse P3 output
BEGIN_MARKER="---BEGIN OPTIMIZED CONTENT---"
END_MARKER="---END OPTIMIZED CONTENT---"

if echo "$RAW_P3" | grep -qF -- "$BEGIN_MARKER"; then
  OPTIMIZED=$(echo "$RAW_P3" | awk "/BEGIN OPTIMIZED CONTENT/{found=1; next} /END OPTIMIZED CONTENT/{found=0} found")
  REPORT=$(echo "$RAW_P3" | awk "/END OPTIMIZED CONTENT/{found=1; next} found")

  echo "✓ P3 output contains optimized content markers — parsing succeeded!"
  echo ""

  echo "$OPTIMIZED" > "$OUT_DIR/04-optimized-content.md"
  echo "Saved 04-optimized-content.md (clean content only)"

  echo "$REPORT" > "$OUT_DIR/05-optimization-report.md"
  echo "Saved 05-optimization-report.md (report only)"
else
  echo "✗ WARNING: P3 output does NOT contain optimized content markers!"
  echo "  First 5 lines of P3 output:"
  echo "$RAW_P3" | head -5
  echo ""
  OPTIMIZED="$RAW_P3"
  REPORT=""
  echo "$OPTIMIZED" > "$OUT_DIR/04-optimized-content.md"
fi

# ===== P4: VALIDATE =====
SYSTEM_P4=$(curl -s "$BASE_URL/api/prompts?platform=$PLATFORM&step=validator" | jq -r '.prompt')
USER_P4="Expression Profile:
$VOICE_PROFILE

Content to Validate:
$OPTIMIZED"

call_llm "$SYSTEM_P4" "$USER_P4" "P4 Validate"
VALIDATION="$STEP_CONTENT"
P4_TIME="$STEP_TIME"; P4_TOKENS="$((STEP_TOKENS_P + STEP_TOKENS_C))"; P4_COST="$STEP_COST"
echo "$VALIDATION" > "$OUT_DIR/06-validation-report.md"
echo "Saved 06-validation-report.md"

# ===== FINAL OUTPUT =====
cat > "$OUT_DIR/07-FINAL-OUTPUT.md" << 'HEADER'
# FINAL OUTPUT — Ready to Use

This is the complete optimized content, ready to copy/paste and publish.
This is what users see in the main content panel after P3 optimization.
The optimization report is stored separately in a collapsible "Optimization Details" section.

---

HEADER
echo "$OPTIMIZED" >> "$OUT_DIR/07-FINAL-OUTPUT.md"
echo ""
echo "Saved 07-FINAL-OUTPUT.md (THE FINAL DELIVERABLE)"

# ===== README =====
cat > "$OUT_DIR/README.md" << EOF
# Dan Koe Blog Pipeline Test — P3 Content/Report Separation

**Date:** $(date +%Y-%m-%d)
**Model:** Claude Sonnet 4.5
**Platform:** Blog
**Creator:** Dan Koe
**Source:** "You Are Learning Slowly" transcript (reformatted as blog samples)
**Topic:** Why most people waste 6 months learning what could take 2 weeks
**Content Type:** Blog Post

## Purpose
Tests the P3 optimizer fix: optimized content is separated from the optimization report.

## Pipeline Results

| Step | Time | Tokens | Cost |
|------|------|--------|------|
| P1 Analyze | ${P1_TIME}s | ${P1_TOKENS} | \$${P1_COST} |
| P2 Generate | ${P2_TIME}s | ${P2_TOKENS} | \$${P2_COST} |
| P3 Optimize | ${P3_TIME}s | ${P3_TOKENS} | \$${P3_COST} |
| P4 Validate | ${P4_TIME}s | ${P4_TOKENS} | \$${P4_COST} |

## Output Files

1. [01-voice-profile.md](./01-voice-profile.md) - Expression profile
2. [02-generated-blog.md](./02-generated-blog.md) - P2 generated blog post
3. [03-p3-raw-output.md](./03-p3-raw-output.md) - Full raw P3 output (content + report)
4. [04-optimized-content.md](./04-optimized-content.md) - **Parsed optimized content only**
5. [05-optimization-report.md](./05-optimization-report.md) - **Parsed optimization report only**
6. [06-validation-report.md](./06-validation-report.md) - P4 validation (fed clean content)
7. **[07-FINAL-OUTPUT.md](./07-FINAL-OUTPUT.md)** - **THE FINAL DELIVERABLE**
EOF

echo ""
echo "=== Test Complete ==="
echo "Files generated:"
ls -lh "$OUT_DIR"/*.md
