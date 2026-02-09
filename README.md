# Primequiz: AI-Powered Dynamic Quiz Platform on GenLayer

Primequiz is a sophisticated educational platform that demonstrates the power of GenLayer's Intelligent Contracts. Unlike traditional learning apps with static question banks, Primequiz generates **dynamic study materials and quizzes on-demand using AI**—with every question and fact verified by GenLayer's consensus system to ensure academic integrity.

### The Innovation

This project showcases how GenLayer's **Non-Comparative Equivalence Principle** enables complex, content-rich applications:

**The Challenge:** How do you generate comprehensive educational content on-chain without:
- Sky-high costs for processing large text blocks?
- Massive delays from redundant AI calls?
- Risking "hallucinations" or corrupted data formats?

**The Solution: Non-Comparative Equivalence Principle**  
1. **Leader Generation**: One validator generates a 10-question quiz and study material using an AI prompt.
2. **Efficient Verification**: Other validators verify the output meets strict criteria (Valid JSON, exactly 10 questions, presence of study material).
3. **Consensus Achievement**: The community agrees on the validity of the content, making it the official on-chain record for that session.

This makes Primequiz:
- ⚡ **Scalable** - Only one complex AI generation per session.
- 💰 **Economical** - Reduced computational overhead despite high-quality content.
- 🎓 **Trustworthy** - Multiple validators ensure the AI followed the pedagogical rules.
- ♾️ **Limitless** - Infinite topics and depth, limited only by your curiosity.

---

## How It Works

### User Experience
1. **Choose a Topic**: Enter any subject (e.g., "Quantum Computing" or "Ancient Rome").
2. **Study Mode**: Read a comprehensive paragraph of study material generated specifically for you.
3. **Take the Challenge**: Solve 10 multiple-choice questions based on the material.
4. **On-Chain Grading**: Get an instant score verified by the blockchain.

### Behind the Scenes (Non-Comparative Equivalence)

User requests "History of Space Flight"
    ↓
Leader validator calls AI: "Create 10 questions + study material"
    ↓
AI returns: `{"study_material": "...", "questions": [...]}`
    ↓
Validators verify:
  ✓ Valid JSON format
  ✓ Exactly 10 questions
  ✓ High-quality study material included
    ↓
Consensus reached → Content stored on-chain for the user
    ↓
Quiz session begins


---

## Why This Matters

### Traditional Educational App Limitations
- Hardcoded question banks (memorizable, static).
- Centralized grading (possible to manipulate or hack).
- Limited scope (only what the developer coded).

### Primequiz Using GenLayer
- ✅ **Truly Dynamic**: AI builds the curriculum on the fly.
- ✅ **Provably Fair**: Grading logic is transparent and executed on-chain.
- ✅ **Infinite Library**: Learn anything, from niche technology to local history.
- ✅ **Decentralized Integrity**: No single entity controls the "correct" answer.

---

## Technical Highlights

### GenLayer Features Demonstrated

**1. Non-Comparative Equivalence Principle**
- Enables subjective educational tasks to reach consensus efficiently.
- Validators check for "reasonableness" and compliance with rules rather than recreating the entire generation.

**2. Native AI Integration**
- Intelligent Contracts directly interface with LLMs.
- No bulky external oracles required for content generation.

**3. Validation Criteria**
The contracts define clear rules for validator audits:
```python
criteria = "The output must be a valid JSON object with study_material and 10 questions."
```

## Performance Notes

⏱️ **Generation may take a few seconds** due to:
- Deep AI processing of complex educational prompts.
- Multi-validator consensus across the GenLayer network.
- High-fidelity response formatting for consensus verification.

---

## What This Demonstrates

Primequiz proves that GenLayer can power "Content-as-Infrastructure":

1. **Revolutionizing EdTech** - Personalized, verifiable AI learning paths.
2. **Solving the Cost/Speed Tradeoff** - Professional content without the high gas fees of redundant generation.
3. **Practical AI Utility** - Real-world application of LLMs in a trustless environment.

# Technical Blueprint

## Project Architecture

- **Frontend**: React + TypeScript (Modern, premium dark-themed UI).
- **Styling**: Tailwind CSS + shadcn/ui (Premium aesthetics and micro-animations).
- **Consensus Layer**: GenLayer (Utilizing `genlayer-js` for state management).
- **Intelligent Contracts**: Python-based contracts (`QuizContract` & `QuizGenerator`) managing the generation lifecycle.

## Decentralized Grading: The "YouGuess" Legacy

The platform utilizes a sophisticated grading mechanism where:
- User answers are sent as a `list[str]`.
- The contract compares them against the stored `correct_option` keys.
- Results are computed and returned as a JSON report, immutable and verifiable.

---

## Installation & Setup

1. **Install**: `npm install`
2. **Env**: Set `VITE_GENLAYER_KEY` in `.env.local`
3. **Run**: `npm run dev`

**Learn anything. Verify everything. Powered by GenLayer.**
