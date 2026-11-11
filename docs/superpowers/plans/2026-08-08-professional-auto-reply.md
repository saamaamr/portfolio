# Professional Portfolio Auto-Reply Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the basic contact-form auto-reply with a polished, responsive, recruiter-friendly HTML email and matching plain-text fallback without changing SMTP delivery behavior.

**Architecture:** Keep `sendContactEmail()` as the delivery coordinator and keep the current pooled Nodemailer transport and retry behavior. Change only `createAutoReply()` output: use fixed professional content, escaped HTML, a table-based inline-style layout, and a plain-text alternative. Verify the message through the existing mocked transporter, then validate the full contact flow and production deployment.

**Tech Stack:** Node.js, Nodemailer, Jest, Gmail SMTP, Vercel

## Global Constraints

- Use the fixed subject **Thank you for contacting Abdullah Al Mamun**.
- Do not promise a 24–48-hour or other fixed response time.
- Include HTML and plain-text message bodies with equivalent information.
- Use inline styles, system fonts, a table-based outer layout, and no external assets, scripts, fonts, analytics, or tracking pixels.
- Escape the submitted name and message before inserting them into HTML.
- Preserve submitted message line breaks in HTML and plain text.
- Keep the owner notification, SMTP settings, retry policy, public contact response, and auto-reply failure tolerance unchanged.
- Keep `.env` ignored and untracked. Never stage, print, or include SMTP credentials in tests or documentation.
- Do not stage `logs/combined.log`.

---

## File Structure

- Modify `tests/email.test.js` - specify the professional auto-reply contract through the mocked transporter.
- Modify `services/email.js` - generate the fixed subject, plain-text fallback, and responsive email-safe HTML.

---

### Task 1: Build and test the professional auto-reply

**Files:**
- Modify: `tests/email.test.js`
- Modify: `services/email.js`

**Interfaces:**
- Consumes: `sendContactEmail(payload, { transporter, sleep, env })`, with payload `{ name: string, email: string, message: string }`.
- Produces: a Nodemailer auto-reply object with `from`, `to`, `subject`, `text`, and `html`; no exported API changes.

- [ ] **Step 1: Add a failing auto-reply design test**

Add this test to `tests/email.test.js`:

```js
it('sends a professional HTML and plain-text acknowledgement', async () => {
  const deliveries = [];
  const transporter = {
    async sendMail(options) {
      deliveries.push(options);
      return { messageId: `${deliveries.length}` };
    },
  };

  await sendContactEmail(
    {
      name: '<b>Recruiter</b>',
      email: 'recruiter@example.com',
      message: '<script>alert(1)</script> First line.\nSecond line.',
    },
    {
      transporter,
      sleep: async () => {},
      env: {
        SMTP_USER: 'portfolio@example.com',
        CONTACT_EMAIL: 'owner@example.com',
      },
    }
  );

  const autoReply = deliveries.find((delivery) => delivery.to === 'recruiter@example.com');

  expect(autoReply).toMatchObject({
    from: '"Abdullah Al Mamun" <portfolio@example.com>',
    to: 'recruiter@example.com',
    subject: 'Thank you for contacting Abdullah Al Mamun',
  });
  expect(autoReply.text).toContain('Hello <b>Recruiter</b>,');
  expect(autoReply.text).toContain('I will review your inquiry and respond as soon as possible.');
  expect(autoReply.text).toContain('First line.\nSecond line.');
  expect(autoReply.text).toContain('Technical Support Engineer');
  expect(autoReply.text).toContain('mamunsandwipi.vercel.app');
  expect(autoReply.text).toContain('This is an automated confirmation');
  expect(autoReply.html).toContain('role="presentation"');
  expect(autoReply.html).toContain('Message received');
  expect(autoReply.html).toContain('Thank you for reaching out');
  expect(autoReply.html).toContain('Hello &lt;b&gt;Recruiter&lt;/b&gt;,');
  expect(autoReply.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(autoReply.html).toContain('First line.<br>Second line.');
  expect(autoReply.html).toContain('Technical Support Engineer');
  expect(autoReply.html).toContain('https://mamunsandwipi.vercel.app');
  expect(autoReply.html).toContain('This is an automated confirmation');
  expect(autoReply.html).not.toContain('<script>');
  expect(autoReply.html).not.toContain('24–48');
  expect(autoReply.text).not.toContain('24–48');
});
```

Keep the existing retry and auto-reply-failure tests unchanged.

- [ ] **Step 2: Run the focused test and confirm the red state**

Run:

```bash
npm test -- --runInBand tests/email.test.js
```

Expected: FAIL because the current auto-reply has no `text` body, uses a personalized old subject, lacks the portfolio role/URL/footer, and contains the 24–48-hour promise.

- [ ] **Step 3: Normalize display values and build the plain-text body**

In `createAutoReply()`, use:

```js
const displayName = String(name).replace(/\s+/g, ' ').trim();
const plainMessage = String(message).replace(/\r\n?/g, '\n');
const safeName = escapeHtml(displayName);
const safeMessage = escapeHtml(plainMessage).replace(/\n/g, '<br>');

const text = [
  `Hello ${displayName},`,
  '',
  'Thank you for contacting me through my portfolio. I have received your message and appreciate your interest.',
  '',
  'I will review your inquiry and respond as soon as possible.',
  '',
  'Your message:',
  plainMessage,
  '',
  'Best regards,',
  'Abdullah Al Mamun',
  'Technical Support Engineer',
  'https://mamunsandwipi.vercel.app',
  '',
  'This is an automated confirmation that your message was received.',
].join('\n');
```

Return `text` on the Nodemailer message object and use the fixed subject.

- [ ] **Step 4: Replace the HTML with the email-safe visual design**

Use a fluid outer presentation table with `width="100%"`, `cellpadding="0"`, `cellspacing="0"`, `role="presentation"`, and background `#f4f7fb`. Inside it, use a 600-pixel maximum-width white presentation table with:

```text
Header background: #0c2141
Accent: #2aa99a
Body text: #24364b
Muted text: #66758a
Border: #d9e2ec
Message panel: #f2f8f7
System font stack: Arial, Helvetica, sans-serif
Body font size: 16px
Body line height: 1.65
```

Build `html` from this complete template:

```js
const html = `<!doctype html>
<html lang="en">
  <body style="margin:0; padding:0; background:#f4f7fb; color:#24364b; font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%; background:#f4f7fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%; max-width:600px; overflow:hidden; border:1px solid #d9e2ec; border-radius:16px; background:#ffffff;">
            <tr>
              <td style="padding:28px 32px; background:#0c2141; border-bottom:4px solid #2aa99a;">
                <p style="margin:0 0 8px; color:#70dfcd; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase;">Message received</p>
                <h1 style="margin:0; color:#ffffff; font-size:26px; line-height:1.25;">Thank you for reaching out</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px; color:#24364b; font-size:16px; line-height:1.65;">
                <p style="margin:0 0 16px;">Hello ${safeName},</p>
                <p style="margin:0 0 16px;">Thank you for contacting me through my portfolio. I have received your message and appreciate your interest.</p>
                <p style="margin:0 0 24px;">I will review your inquiry and respond as soon as possible.</p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%; margin:0 0 24px; background:#f2f8f7; border-left:4px solid #2aa99a;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 8px; color:#167f73; font-size:13px; font-weight:700; letter-spacing:.6px; text-transform:uppercase;">Your message</p>
                      <p style="margin:0; color:#35465a; font-size:15px; line-height:1.6; word-break:break-word;">${safeMessage}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;">Best regards,<br><span style="font-weight:700; color:#0c2141;">Abdullah Al Mamun</span><br>Technical Support Engineer</p>
                <p style="margin:8px 0 0;"><a href="https://mamunsandwipi.vercel.app" style="color:#167f73; font-weight:700; text-decoration:underline;">mamunsandwipi.vercel.app</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px; border-top:1px solid #d9e2ec; background:#f8fafc; color:#66758a; font-size:12px; line-height:1.5;">
                This is an automated confirmation that your message was received.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
```

Do not interpolate unescaped `name` or `message` anywhere in `html`.

- [ ] **Step 5: Run the focused email suite and confirm green**

Run:

```bash
npm test -- --runInBand tests/email.test.js
```

Expected: all email tests pass, including retry exhaustion and notification success when auto-reply delivery fails.

- [ ] **Step 6: Commit the auto-reply implementation**

Stage only `services/email.js` and `tests/email.test.js`:

```bash
git commit -m "feat: design professional contact auto-reply"
```

---

### Task 2: Verify and deploy the mail-format change

**Files:**
- Verify: `services/email.js`
- Verify: `tests/email.test.js`
- Verify: production `/contact`

**Interfaces:**
- Consumes: the professional auto-reply object from Task 1 and existing Vercel production SMTP variables.
- Produces: a tested production acknowledgement delivered through the existing Gmail SMTP account.

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npm test -- --runInBand
git diff --check
```

Expected: all 9 suites pass, the new email test increases the total from 78 to 79 tests, and `git diff --check` prints nothing.

- [ ] **Step 2: Audit mail content and credential safety**

Run:

```bash
rg -n "24–48|Thank You for Reaching Out" services/email.js tests/email.test.js
git status --short
git ls-files .env
```

Expected: the first command finds only negative test assertions if the old phrases are referenced there; `.env` is absent from tracked files; only intended commits and the pre-existing `logs/combined.log` modification remain.

- [ ] **Step 3: Push the verified main branch**

Fetch remote `main`, confirm `origin/main...HEAD` has no remote-only commits, then push `main`. Do not force-push.

- [ ] **Step 4: Wait for the Vercel production deployment**

Use the linked project `saamaamrs-projects/saamaamr-portfolio`. Confirm the latest production deployment reports `Ready` and the alias `https://mamunsandwipi.vercel.app` points to it. Do not change the already verified SMTP values.

- [ ] **Step 5: Submit one non-sensitive production verification message**

Send:

```json
{
  "name": "Portfolio verification",
  "email": "mamun872381cpi@gmail.com",
  "message": "Professional auto-reply production verification after the approved email design update."
}
```

Expected: `POST https://mamunsandwipi.vercel.app/contact` returns HTTP 200 with `status: "success"`. Confirm the received auto-reply has the fixed subject, professional card design, plain-text alternative, role, portfolio link, and no response-time promise.

- [ ] **Step 6: Verify final local and remote state**

Run:

```bash
git rev-parse HEAD
git rev-parse origin/main
git status --branch --short
```

Expected: local and remote hashes match; the branch is synchronized; only `logs/combined.log` remains modified locally.
