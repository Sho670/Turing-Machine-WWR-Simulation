# Turing-Machine-WWR-Simulation
# Turing Machine for Language \(L = \{ww^R\}\)

> **Theory of Computation | Turing Machine Project**

This project implements a **single‑tape deterministic Turing Machine (DTM)** that accepts the language  
\[
L = \{ww^R \mid w \in \{0,1\}^*\}
\]
where \(w^R\) is the reverse of the string \(w\). The machine reads an input string, checks if it is of the form \(ww^R\), and halts in an **accept** state only if the string belongs to \(L\); otherwise it halts in a **reject** (or non‑accepting) configuration.

---

## 🧠 What is the language \(ww^R\)?

The language \(L = \{ww^R\}\) consists of all strings over the alphabet \(\{0, 1\}\) such that the first half of the string equals the reverse of the second half.

- If \(w = 10110\), then \(w^R = 01101\), and the full string is \(1011001101\).
- Typical accepted strings: \(\epsilon\) (empty), `00`, `11`, `0110`, `1001`, `01100110`, etc.
- Rejected inputs: `01`, `10`, `001`, `1010` (not symmetric in this form).

This language represents a special kind of **even‑length palindrome** and is **context‑sensitive**, but it is not context‑free; it is **decidable** by a Turing machine.

---



## 🧰 Turing Machine Design (High‑Level Idea)

The machine works by **matching symbols from the outer edges toward the middle**, using marker symbols to “cross‑off” matched pairs.

### 1. Input Setup

- Tape alphabet: \(\Sigma = \{0, 1\}\)
- Tape symbols used: \(\{0, 1, X, Y, \text{\textvisiblespace}\}\), where:
  - `X` marks matched `1`s,
  - `Y` marks matched `0`s,
  - `\text{\textvisiblespace}` (blank) marks the end of the usable tape.

- The input string is surrounded by blanks; the head starts at the leftmost symbol.

### 2. Algorithm Sketch

1. **From left:**  
   - If current symbol is `0`, replace it with `Y` and move right.  
   - If current symbol is `1`, replace it with `X` and move right.

2. **Scan to the right end:**  
   - Move right until a blank or the end‑marker is found.  
   - Then move one step left to the last symbol.

3. **Compare and mark:**  
   - If the last symbol matches the mark (i.e., `0` if first was `0`, `1` if first was `1`), replace it with the same mark (`Y` or `X`) and move left.

4. **Return to next unread symbol:**  
   - Move left until a blank or the beginning of the marked region is reached, then move one step right to the next unread symbol.

5. **Repeat** the matching process until the middle is reached.

6. **Acceptance:**  
   - If all symbols are successfully matched and the head reaches a fully‑marked region with no mismatch, the machine enters an **accept** state.  
   - If at any step a mismatch is found (e.g., `0` vs `1`), the machine halts in a **reject** state.

This approach ensures that the first half equals the reverse of the second half by pairing the \(i\‑\text{th}\) symbol from the left with the \(i\‑\text{th}\) symbol from the right.

---

## 🧩 State‑Transition Overview (Conceptual)

Below is a **conceptual transition table** layout (you can replace states with your exact names, e.g., `q0, q1, ...`).

### States (Example)

- `q0` : Start state, read first symbol.
- `qr` : Move right to end.
- `ql` : Move left to next symbol.
- `qa` : Accept state.
- `qrj` : Reject state.

### Example Transitions

| Current State | Read Symbol | Write Symbol | Move | Next State |
|--------------|-------------|--------------|------|------------|
| `q0`         | `0`         | `Y`          | R    | `qr`       |
| `q0`         | `1`         | `X`          | R    | `qr`       |
| `q0`         | `B`         | `B`          | –    | `qa` (accept empty) |
| `qr`         | `{0,1}`     | `{0,1}`      | R    | `qr`       |
| `qr`         | `B`         | `B`          | L    | `ql`       |
| `ql`         | `0`         | `Y`          | L    | `ql`       |
| `ql`         | `1`         | `X`          | L    | `ql`       |
| `ql`         | `B`         | `B`          | R    | `q0`       |
| ... (mismatch rules) | – | – | – | `qrj` |

Concrete implementations usually include extra states to handle edge cases (e.g., odd length, malformed input).

---



## 🖥️ Project Implementation

This project can be implemented in any of the following ways:

- **Simulator‑based:**  
  - Use a Python or JS simulator that reads a transition table and runs the machine step‑by‑step.
  - Example: a `TuringMachine` class that holds:
    - `states`, `alphabet`, `tape`, `current_state`, `head_position`, `transitions`.

- **Visualization:**  
  - Show one step per line, printing:
    - Tape contents.
    - Current state.
    - Direction of head movement.


## ✅ Example Runs

### 1. Input: `00`

1. Tape initially: `_ 0 0 _`  
   - Head at first `0`.  
2. Replace first `0` with `Y`, move right.  
3. Reach last symbol, compare `0` with expectation; replace with `Y`.  
4. Middle reached; all symbols are marked and matched → **Accept**.

### 2. Input: `0110`

1. First `0` → `Y`, move right to end.  
2. Last `0` → `Y`, move left to next unread.  
3. Next `1` → `X`, move right, last `1` → `X`.  
4. All symbols paired correctly → **Accept**.

### 3. Input: `01`

- Attempt to match `0` (left) with `1` (right) → mismatch → **Reject**.

These runs demonstrate that the machine correctly enforces the \(ww^R\) structure.

---


## 🖋️ Markdown Diagram

```markdown
- `q0` → `qr` on `0/B` (marking and moving right).
- `qr` moves right until `B`, then moves left to `ql`.
- `ql` moves left marking symbols, then returns to `q0`.
- On all‑match: `q0` reaches marked region and enters `qa`.
- On mismatch: the machine enters `qrj`.
```

