# Virtuoso

A single-page prototype site for Virtuoso, a music training academy that matches
young students with collegiate and graduate performers from leading American
conservatories.

Static HTML, CSS and vanilla JavaScript. No framework, no build step, no
dependencies — open `index.html` and it works. Everything here is portable to
any host if you outgrow GitHub Pages.

```
index.html                 the entire page
assets/css/style.css       design system + all section styles
assets/css/fonts.css       self-hosted @font-face declarations
assets/fonts/              Cormorant Garamond + Inter (woff2, SIL OFL)
assets/js/main.js          form validation, submission, image fallback
assets/img/                photography — see "Adding the photography"
.nojekyll                  tells GitHub Pages to serve files as-is
```

## Local preview

```sh
npx http-server -p 8099    # then open http://127.0.0.1:8099
```

Opening `index.html` directly in a browser also works.

## Three things to do before this goes public

### 1. Connect the form

The form is fully built and validated but is **not connected to a mailbox**.
Until it is, a valid submission reports that nothing was sent rather than
faking a success message.

To activate it with [Web3Forms](https://web3forms.com) — 250 submissions/month,
free, no account required:

1. Enter your email at web3forms.com; they email you an access key.
2. In `index.html`, find the `<form id="lead-form">` tag and set:
   ```html
   data-endpoint="https://api.web3forms.com/submit"
   data-access-key="YOUR-KEY-HERE"
   ```

That's the whole change. The access key is safe to commit — it only allows
sending mail to the address it is registered to. Submissions arrive in your
inbox; a honeypot field filters most bots.

[Formspree](https://formspree.io) works the same way if you'd rather have a
dashboard, but its free tier is 50 submissions/month rather than 250.

### 2. Correct the conservatory names

The trust bar under the hero lists Juilliard, Curtis, NEC, Eastman, Peabody and
Colburn. **These are placeholders** illustrating the intended network. Replace
them with schools you have actually recruited instructors from before the page
is public — the section is marked with a comment in `index.html`.

The same applies to the FAQ, which currently states policies (complimentary
evaluation lesson, free rematching, vetting process) as though they are settled.
Read it as a proposal and adjust it to what you will actually commit to.

### 3. Set the contact address

`hello@virtuoso.academy` and `teach@virtuoso.academy` in the footer, and the
fallback address in `assets/js/main.js`, are placeholders.

## Adding the photography

The page ships without image files. `assets/js/main.js` detects the missing
files and hides their containers, so the layout stays deliberate rather than
broken — the hero falls back to a layered gradient with a faint engraved
staff-line texture.

To add photography, drop files with these exact names into `assets/img/`:

| Filename | Ratio | Subject |
|---|---|---|
| `hero-recital-hall.jpg` | 21:9 | Grand piano alone on an empty recital-hall stage, raking morning light. Keep the left third uncluttered — the headline sits there. |
| `about-practice-room.jpg` | 3:2 | Cello against a chair in a sunlit practice room. |
| `score-detail.jpg` | 3:2 | Close detail of an annotated score. Used at 22% opacity behind the dark Giving Back section, so contrast matters more than detail. |
| `conservatory-corridor.jpg` | 4:3 | Historic conservatory corridor. Currently unused — held for a future section. |

No markup changes are needed; the images appear as soon as the files exist.
Export at roughly 2400px wide for the hero and 1600px for the rest, JPEG
quality ~80.

## Deploying to GitHub Pages

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder
`/ (root)`. The site publishes at `https://elijahj89.github.io/virtuoso/`.

All asset paths are relative, so the project-subpath URL works without
configuration, and the site will also work unchanged at a custom domain or a
different host later.

## Accessibility and browser support

Semantic landmarks, a skip link, labelled form fields with `aria-invalid` and
live-region error messages, visible focus rings, and `prefers-reduced-motion`
honoured. The page is fully readable with JavaScript disabled; only form
submission and the image fallback require it. Verified for zero horizontal
overflow at 390px and 1440px.

## Sources for the Giving Back figures

The tuition, earnings and debt figures are cited to
[U.S. News](https://www.usnews.com/best-colleges/new-england-conservatory-of-music-2194/paying)
and
[CollegeSimply](https://www.collegesimply.com/colleges/massachusetts/the-new-england-conservatory-of-music/price/),
which draw on U.S. Department of Education College Scorecard data. They
describe the sector, not any individual instructor. Re-check them before
launch — they move year to year.
