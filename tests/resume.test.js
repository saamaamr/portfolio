/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

const resumeSource = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'resume.html'),
  'utf8'
);
const resume = new DOMParser().parseFromString(resumeSource, 'text/html');

describe('English resume', () => {
  it('uses universal support positioning and evidence-backed claims', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');
    const profile = resume.querySelector('#profile-title + .summary');
    const pages = [...resume.querySelectorAll('article.page')];
    const competencies = [...resume.querySelectorAll('[data-core-competency]')];

    expect(pages).toHaveLength(2);
    expect(pages.map((page) => page.getAttribute('aria-label'))).toEqual([
      'Resume page 1',
      'Resume page 2',
    ]);
    expect(resume.querySelector('.role').textContent.trim()).toBe(
      'Technical Support & IT Operations Professional'
    );
    expect(profile).not.toBeNull();
    expect(profile.textContent.trim()).toBe(
      'Technical support and IT operations professional with 7+ years of experience across software, travel operations, and financial services. Skilled in end-user support, hardware and software troubleshooting, website maintenance, defect reproduction, documentation, and clear coordination between users, clients, and technical teams.'
    );
    expect(competencies).toHaveLength(3);
    expect(competencies.map((entry) => entry.querySelector('h3').textContent.trim())).toEqual([
      'End-user support',
      'Website support',
      'Communication & quality',
    ]);
    expect(text).toContain('Installed and maintained workplace hardware and software.');
    expect(text).toContain('Open to Technical Support, IT Support, and remote opportunities');
    expect(text).not.toMatch(/50\+ workstations|24\/7|improved .*%|reduced .*%/i);
    expect(text).not.toMatch(/Web Developer|Full[- ]Stack Developer/i);
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
  });

  it('presents three curated technical-work examples in the approved order', () => {
    const text = resume.body.textContent.replace(/\s+/g, ' ');
    const entries = [...resume.querySelectorAll('[data-selected-work]')];

    expect(entries.map((entry) => entry.querySelector('h3').textContent.trim())).toEqual([
      'Noor Notes',
      'Emergency Medicine Finder',
      'House Shifting Services',
    ]);
    expect(entries[0].textContent).toContain('Native Linux desktop application');
    expect(entries[1].textContent).toContain('Full-stack system prototype');
    expect(entries[1].textContent).not.toMatch(/production-grade|deployment-ready/i);
    expect(entries[2].textContent).toContain('Collaborative project');
    expect(entries[2].textContent).toContain('Individual ownership is not claimed');
    expect(text).toContain('Selected Technical Work');
    expect(text).not.toContain('Developer Evidence');
    expect(text).not.toContain('PCIU CGPA Calculator');
  });

  it('keeps only the approved contact and public-work links clickable', () => {
    const hrefs = [...resume.querySelectorAll('a')].map((link) => link.href);

    expect(hrefs).toEqual([
      'mailto:mamun872381cpi@gmail.com',
      'tel:+8801580831003',
      'https://www.linkedin.com/in/abdullah-a-699a90117/',
      'https://github.com/saamaamr',
      'https://mamunsandwipi.vercel.app/',
      'https://github.com/saamaamr/noor-notes',
      'https://github.com/saamaamr/emergency-medicine-finder',
      'https://github.com/saamaamr/house-shifting-services',
    ]);
  });

  it('avoids semantic elements that Chrome maps to invalid PDF 1.4 structure roles', () => {
    expect(resume.querySelector('strong, aside')).toBeNull();
  });
});
