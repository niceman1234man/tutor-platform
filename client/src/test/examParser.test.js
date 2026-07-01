import { describe, it, expect } from 'vitest'

// The same parser logic used in ExamForm.jsx — extracted for testing
function parseExamHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const questionEls = doc.querySelectorAll('.question')
  const questions = []
  const errors = []

  questionEls.forEach((el, i) => {
    const questionText =
      el.querySelector('.question-text')?.textContent?.trim() ||
      el.querySelector('p')?.textContent?.trim() ||
      el.querySelector('h3')?.textContent?.trim() || ''

    const liEls = el.querySelectorAll('.options li, ul li, ol li')
    const options = Array.from(liEls).map((li) => li.textContent.trim())

    let correctAnswer = null
    const answerSpan = el.querySelector('.answer')
    if (answerSpan) {
      const idx = Number(answerSpan.textContent.trim())
      if (!isNaN(idx)) correctAnswer = idx
    } else {
      Array.from(liEls).forEach((li, j) => {
        if (li.classList.contains('correct')) correctAnswer = j
      })
    }

    const explanation = el.querySelector('.explanation')?.textContent?.trim() || ''

    if (!questionText) { errors.push(`Question ${i + 1}: missing question text.`); return }
    if (options.length < 2) { errors.push(`Question ${i + 1}: needs at least 2 options.`); return }
    if (correctAnswer === null || correctAnswer < 0 || correctAnswer >= options.length) {
      errors.push(`Question ${i + 1}: correct answer not found.`); return
    }
    questions.push({ question: questionText, options, correctAnswer, explanation })
  })

  return { questions, errors, total: questions.length }
}

// ─────────────────────────────────────────────
describe('HTML Exam Parser', () => {

  it('parses a single question with class="correct" on the li', () => {
    const html = `
      <div class="question">
        <p class="question-text">What is 2 + 2?</p>
        <ul class="options">
          <li>3</li>
          <li class="correct">4</li>
          <li>5</li>
          <li>6</li>
        </ul>
        <span class="explanation">Basic arithmetic.</span>
      </div>`
    const result = parseExamHTML(html)
    expect(result.total).toBe(1)
    expect(result.errors).toHaveLength(0)
    expect(result.questions[0].question).toBe('What is 2 + 2?')
    expect(result.questions[0].correctAnswer).toBe(1)
    expect(result.questions[0].explanation).toBe('Basic arithmetic.')
  })

  it('parses correct answer from <span class="answer">0</span>', () => {
    const html = `
      <div class="question">
        <p>Capital of Ethiopia?</p>
        <ul>
          <li>Nairobi</li>
          <li>Addis Ababa</li>
          <li>Cairo</li>
        </ul>
        <span class="answer">1</span>
      </div>`
    const result = parseExamHTML(html)
    expect(result.questions[0].correctAnswer).toBe(1)
    expect(result.questions[0].options[1]).toBe('Addis Ababa')
  })

  it('parses multiple questions correctly', () => {
    const html = `
      <div class="question">
        <p class="question-text">Q1?</p>
        <ul><li class="correct">A</li><li>B</li></ul>
      </div>
      <div class="question">
        <p class="question-text">Q2?</p>
        <ul><li>X</li><li class="correct">Y</li></ul>
      </div>`
    const result = parseExamHTML(html)
    expect(result.total).toBe(2)
    expect(result.questions[0].correctAnswer).toBe(0)
    expect(result.questions[1].correctAnswer).toBe(1)
  })

  it('reports error when question text is missing', () => {
    const html = `
      <div class="question">
        <ul><li class="correct">A</li><li>B</li></ul>
      </div>`
    const result = parseExamHTML(html)
    expect(result.total).toBe(0)
    expect(result.errors[0]).toMatch(/missing question text/)
  })

  it('reports error when fewer than 2 options', () => {
    const html = `
      <div class="question">
        <p>Only one option?</p>
        <ul><li class="correct">Just one</li></ul>
      </div>`
    const result = parseExamHTML(html)
    expect(result.errors[0]).toMatch(/at least 2 options/)
  })

  it('reports error when correct answer is not marked', () => {
    const html = `
      <div class="question">
        <p>No answer marked?</p>
        <ul><li>A</li><li>B</li><li>C</li></ul>
      </div>`
    const result = parseExamHTML(html)
    expect(result.errors[0]).toMatch(/correct answer not found/)
  })

  it('returns empty when no .question elements found', () => {
    const html = `<div><p>Nothing here</p></div>`
    const result = parseExamHTML(html)
    expect(result.total).toBe(0)
    expect(result.errors).toHaveLength(0)
  })

  it('skips invalid questions but still imports valid ones', () => {
    const html = `
      <div class="question">
        <p class="question-text">Good question?</p>
        <ul><li class="correct">Yes</li><li>No</li></ul>
      </div>
      <div class="question">
        <ul><li>No question text</li><li>here</li></ul>
      </div>`
    const result = parseExamHTML(html)
    expect(result.total).toBe(1)
    expect(result.errors).toHaveLength(1)
  })
})
