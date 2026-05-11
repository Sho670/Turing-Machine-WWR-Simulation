# Turing-Machine-WWR-Simulation
# Turing Machine for Language \(L = \{ww^R\}\)

> **Theory of Computation | Turing Machine Project**

This project implements a **single‑tape deterministic Turing Machine (DTM)** that accepts the language  
\[
L = \{ww^R \mid w \in \{0,1\}^*\}
\]
where \(w^R\) is the reverse of the string \(w\). The machine reads an input string, checks if it is of the form \(ww^R\), and halts in an **accept** state only if the string belongs to \(L\); otherwise it halts in a **reject** (or non‑accepting) configuration. [web:1][web:4]

---

## 🧠 What is the language \(ww^R\)?

The language \(L = \{ww^R\}\) consists of all strings over the alphabet \(\{0, 1\}\) such that the first half of the string equals the reverse of the second half. [web:1][web:4]

- If \(w = 10110\), then \(w^R = 01101\), and the full string is \(1011001101\).
- Typical accepted strings: \(\epsilon\) (empty), `00`, `11`, `0110`, `1001`, `01100110`, etc.
- Rejected inputs: `01`, `10`, `001`, `1010` (not symmetric in this form).

This language represents a special kind of **even‑length palindrome** and is **context‑sensitive**, but it is not context‑free; it is **decidable** by a Turing machine. [web:1][web:9]

---

