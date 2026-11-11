# Selected work preview sources

The portfolio uses real application interfaces. The captions identify demonstration data, and the project descriptions retain their prototype and collaboration disclosures.

## Noor Notes

`public/assets/evidence/noor-notes-editor.png` is copied unchanged from the public project's `docs/images/1.1.3/noor-notes-editor.png` release gallery, reviewed at source revision `212f6f0d2c57ecb4b16c0e39c820970d8a03d6c6`. It shows the native editor, note library, formatting controls, and synthetic demonstration notes. This is the retained v1.1.3 gallery image, not a new capture of the current desktop release.

Source: [Noor Notes](https://github.com/saamaamr/noor-notes).

## Emergency Medicine Finder

`public/assets/evidence/emergency-medicine-dashboard.jpg` was captured from the running `/pharmacy/dashboard` interface on November 11, 2026, using source revision `f990d70185f515289a614e627b284feccefabfde`. The sample pharmacy, accounts, suppliers, inventory, purchases, expenses, and sales were created in a separate local database. No real customer or transaction records appear.

The temporary runtime used a private MariaDB Unix socket, loopback-only HTTP, lowercase aliases for the source asset directories, and a correction to read the signed authentication cookie written by the original login controller. SMTP and scheduled backups were disabled. Templates, stylesheets, and browser JavaScript were unchanged. The screenshot uses the application's existing light theme.

Source: [Emergency Medicine Finder](https://github.com/saamaamr/emergency-medicine-finder).

## House Shifting Services

`public/assets/evidence/house-shifting-services-demo.jpg` was captured from the running public `/services` page on November 11, 2026, using source revision `c1a8554411b4701539d4098e84a11a627919c622`. It shows the three synthetic Studio Move, Family Home Move, and Office Relocation listings. The viewport was scrolled to show the complete service cards and booking controls.

The source did not include the original team database schema. A temporary compatibility schema was derived from the existing queries solely to render the application with fictional records. The runtime used an isolated local database, loopback-only HTTP, lowercase asset aliases, and a non-sending mail transport. Templates, stylesheets, and browser JavaScript were unchanged.

Source: [House Shifting Services](https://github.com/saamaamr/house-shifting-services).

## Capture and publication

Both web previews were captured directly in the browser, with the scrollbar excluded from the image. They are 1250 by 703 pixel JPEGs. The Noor Notes image is the original 1248 by 702 pixel PNG. No interface elements or data were added to the images after capture. The portfolio supplies the surrounding frames and localized captions.

Only the images are published with the portfolio. Temporary application servers, credentials, fixture databases, and runtime changes are excluded. These captures demonstrate the existing interfaces and do not establish production readiness or full workflow test coverage.
