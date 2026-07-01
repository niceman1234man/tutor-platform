import { describe, it, expect } from 'vitest'
import * as cheerio from 'cheerio'

// The exact same parsing logic from adminCotroller.js — importExamFromHTML
function parseExamHTML(html) {
  const $ = cheerio.load(html)
  const questions = []
  const errors = []

  $('.question').each((i, el) => {
    const questionText =
      $(el).find('.question-text').text().trim() ||
      $(el).find('p').first().text().trim() ||
      $(el).find('h3').text().trim() ||
      $(el).find('h4').text().trim()

    const options = []
    $(el).find('.options li, ul li, ol li').each((j, li) => {
      options.push($(li).text().trim())
    })

    let correctAnswer = null
    const answerSpan = $(el).find('.answer').text().trim()
    if (answerSpan !== '') {
      correctAnswer = Number(answerSpan)
    } else {
      $(el).find('.options li, ul li, ol li').each((j, li) => {
        if ($(li).hasClass('correct') || $(li).attr('data-correct') === 'true') {
          correctAnswer = j
        }
      })
    }

    const explanation =
      $(el).find('.explanation').text().trim() ||
      $(el).find('blockquote').text().trim()

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
describe('Server: Cheerio HTML Exam Parser', () => {

  it('parses question with class="correct" on li', () => {
    const html = `<div class="question">
      <p class="question-text">What is Node.js?</p>
      <ul class="options">
        <li class="correct">A JavaScript runtime</li>
        <li>A database</li>
        <li>A CSS framework</li>
      </ul>
      <span class="explanation">Node.js is a JS runtime built on V8.</span>
    </div>`
    const { questions, errors } = parseExamHTML(html)
    expect(errors).toHaveLength(0)
    expect(questions[0].correctAnswer).toBe(0)
    expect(questions[0].explanation).toBe('Node.js is a JS runtime built on V8.')
  })

  it('parses correct answer from .answer span index', () => {
    const html = `<div class="question">
      <p>Which is a NoSQL database?</p>
      <ul><li>MySQL</li><li>PostgreSQL</li><li>MongoDB</li></ul>
      <span class="answer">2</span>
    </div>`
    const { questions } = parseExamHTML(html)
    expect(questions[0].correctAnswer).toBe(2)
    expect(questions[0].options[2]).toBe('MongoDB')
  })

  it('parses data-correct="true" attribute', () => {
    const html = `<div class="question">
      <p>HTTP stands for?</p>
      <ul>
        <li>HyperText Transfer Protocol</li>
        <li data-correct="true">HyperText Transfer Protocol</li>
        <li>HighText Transfer Protocol</li>
      </ul>
    </div>`
    const { questions } = parseExamHTML(html)
    expect(questions[0].correctAnswer).toBe(1)
  })

  it('parses multiple questions in one file', () => {
    const html = `
      <div class="question">
        <p class="question-text">Q1?</p>
        <ul><li class="correct">Right</li><li>Wrong</li></ul>
      </div>
      <div class="question">
        <p class="question-text">Q2?</p>
        <ul><li>Wrong</li><li>Wrong</li><li class="correct">Right</li></ul>
      </div>`
    const { questions, total } = parseExamHTML(html)
    expect(total).toBe(2)
    expect(questions[1].correctAnswer).toBe(2)
  })

  it('collects errors without stopping whole parse', () => {
    const html = `
      <div class="question">
        <p class="question-text">Valid question?</p>
        <ul><li class="correct">A</li><li>B</li></ul>
      </div>
      <div class="question">
        <ul><li>No question text here</li><li>B</li></ul>
      </div>`
    const { questions, errors } = parseExamHTML(html)
    expect(questions).toHaveLength(1)
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/missing question text/)
  })

  it('returns zero questions when HTML has no .question elements', () => {
    const { total, errors } = parseExamHTML('<div><p>Random content</p></div>')
    expect(total).toBe(0)
    expect(errors).toHaveLength(0)
  })
})
