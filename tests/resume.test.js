/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

const resumeSource = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'resume.html'),
  'utf8'
);
const resume = new DOMParser().parseFromString(resumeSource, 'text/html');

describe('English resume', () => {
  it('uses support-only positioning and evidence-backed claims', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');

    expect(text).toContain('Technical Support Engineer');
    expect(text).toContain('7+ years in technology');
    expect(text).toContain('50+ workstations');
    expect(text).toContain('Open to Technical Support and remote opportunities');
    expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
    expect(text).not.toMatch(
      /improved support team response|improved .*%|reduced .*%|24\/7|minimized downtime|optimized outcomes/i
    );
    expect(text).toContain('Developer Evidence');
  });

  it('keeps recruiter-relevant education and accurate evidence boundaries', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');

    expect(text).toContain('B.Sc. in Computer Science Engineering');
    expect(text).toContain('GPA 3.76 / 4.00');
    expect(text).toContain('Diploma in Engineering, Computer Technology');
    expect(text).toContain('IT Support Technician, Levels 1 & 2');
    expect(text).not.toContain('GPA 2.62');
    expect(text).not.toContain('S.S.C.');
    expect(text).not.toContain('Smart Attendance Tracker');
    expect(text).not.toContain('Private case study');
    expect(text).toContain('production-grade feature scope');
    expect(text).toContain('not deployment-ready');
    expect(text).toContain('Collaborative work');
    expect(text).toContain('Collaborative contribution');
  });

  it('presents the verified developer evidence in the approved order', () => {
    const entries = [...resume.querySelectorAll('[data-developer-evidence]')];

    expect(entries.map((entry) => entry.querySelector('h3').textContent.trim())).toEqual([
      'Noor Notes',
      'Emergency Medicine Finder',
      'House Shifting Services',
      'PCIU CGPA Calculator',
    ]);
    expect(entries[0].textContent).toContain('Native Linux desktop application');
    expect(entries[1].textContent).toContain('Full-stack web application');
    expect(entries[2].textContent).toContain('Collaborative work');
    expect(entries[3].textContent).toContain('Collaborative contribution');
  });

  it('keeps contact and public profile links clickable without exposing private source', () => {
    const hrefs = [...resume.querySelectorAll('a')].map((link) => link.href);

    expect(hrefs.some((href) => href.startsWith('mailto:'))).toBe(true);
    expect(hrefs.some((href) => href.startsWith('tel:'))).toBe(true);
    expect(hrefs.some((href) => href.includes('linkedin.com'))).toBe(true);
    expect(hrefs.some((href) => href === 'https://github.com/saamaamr')).toBe(true);
    expect(hrefs.some((href) => href.includes('github.com/saamaamr/noor-notes'))).toBe(true);
    expect(hrefs.some((href) => href.includes('emergency-medicine-finder'))).toBe(true);
    expect(hrefs.some((href) => href.includes('house-shifting-services'))).toBe(true);
    expect(hrefs.some((href) => href.includes('pciu-cgpa-calculator'))).toBe(true);
    expect(hrefs.some((href) => href.includes('mamunsandwipi.vercel.app'))).toBe(true);
    expect(hrefs.some((href) => /attendance/i.test(href))).toBe(false);
  });

  it('avoids semantic elements that Chrome maps to invalid PDF 1.4 structure roles', () => {
    expect(resume.querySelector('strong, aside')).toBeNull();
  });
});
