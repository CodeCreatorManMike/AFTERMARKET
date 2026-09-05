# AFTERMARKET — Brand Guide v1.0

> **Cape Town · Peer-to-peer event ticket resale, held safe in escrow**

---

## 01. Brand Idea

**AFTERMARKET** is a youth-focused event ticket resale marketplace built around one core idea:

> **Tickets change hands. Money stays safe.**

The product should not feel like a bank, corporate fintech platform, or generic ticketing website.

It should sit somewhere between:

**event culture × streetwear × marketplace × fintech trust × ticket ephemera**

The visual identity should communicate two things at the same time:

- **ENERGY** — events, nightlife, movement, urgency, discovery
- **TRUST** — verification, escrow, secure transfer, reputation

That tension is the foundation of the brand.

---

## 02. Logo System

### Primary Logo

Use the **AM ticket / exchange mark** as the main brand mark.

It works because the mark already contains:

- **A + M** → Aftermarket
- **Ticket notches** → events / ticketing
- **Opposing arrows** → resale / exchange
- **Coral + Lime** → sell / buy movement
- **Ink structure** → security and solidity

Recommended use:

- Website header
- App splash screen
- App icon variants
- Social avatars
- Loading screens
- Ticket verification screens
- Merchandise
- Stickers
- Event signage

> **Asset suggestion:** save the primary logo as `assets/aftermarket-primary-logo.png` and `assets/aftermarket-primary-logo.svg`.

### Secondary Mark

Use the **circular arrows + ticket** mark where the concept of resale / exchange matters more than the company initials.

Best use cases:

- Marketplace empty states
- Resell actions
- Transfer animations
- Ticket verification
- Escrow status
- Social content
- App feature icons

### Wordmark

Keep the wordmark simple:

# AFTERMARKET.

Use **Archivo Black / Archivo 900**.

Prefer uppercase.

Keep the full stop. It gives the name finality and makes it feel like a label rather than a generic startup name.

### Logo Family

- **Primary:** AM Exchange Ticket Mark
- **Secondary:** Circular Ticket Exchange Mark
- **Wordmark:** `AFTERMARKET.`
- **Trust Mark:** Lime verification / check symbol
- **Micro Mark:** Simplified `AM` for favicon / tiny UI

---

## 03. Core Colour Palette

The identity should remain intentionally restricted to four core colours.

| Colour | Hex | Brand Name | Purpose |
|---|---|---|---|
| Coral | `#FF5470` | **Resale Coral** | Energy, selling, CTAs, urgency |
| Ink | `#14102B` | **Shop Floor Ink** | Main background, structure, depth |
| Lime | `#C6FF3D` | **Verified Lime** | Trust, verification, success |
| Cream | `#F5F0E6` | **Stock Cream** | Ticket paper, text, light surfaces |

---

## 04. Colour Hierarchy

Recommended overall site balance:

- **55% Ink**
- **25% Cream**
- **12% Coral**
- **8% Lime**

If Coral and Lime appear everywhere, the identity starts to feel childish or gaming-oriented.

Use them with meaning.

### Shop Floor Ink — `#14102B`

**Ink is the world.**

The website should primarily live on Ink.

Think:

- dark venue
- night sky
- club poster
- ticket desk
- event app at 1AM

Use for:

- backgrounds
- navigation
- cards
- footers
- modal backgrounds
- logo outlines
- primary typography on light surfaces

### Stock Cream — `#F5F0E6`

Avoid pure white where possible.

Cream gives the interface a slightly physical feeling:

- ticket stock
- receipt paper
- wristbands
- printed event posters

Use for:

- headings
- body copy
- cards
- ticket surfaces
- form fields
- large text areas

### Resale Coral — `#FF5470`

Coral means:

**sell / discover / action / urgency**

Use for:

- `SELL TICKET`
- `VIEW EVENT`
- event dates
- sale prices
- hover states
- promotional cards
- active marketplace states

### Verified Lime — `#C6FF3D`

Lime should have a strict semantic meaning.

**Lime = safe / verified / available / complete**

Examples:

- `✓ VERIFIED`
- `✓ TICKET SECURED`
- `✓ TRANSFER COMPLETE`
- `✓ FUNDS PROTECTED`
- `✓ SELLER VERIFIED`

This keeps Lime useful rather than decorative.

---

## 05. Supporting UI Colours

Do not create a large secondary palette.

Instead, derive interface colours from the core four.

### Ink Surface

`#1D1838`

Use for cards sitting on top of the main Ink background.

### Ink Elevated

`#282148`

Use for hover states, menus, active surfaces and raised UI.

### Muted Cream

`#B9B3AD`

Use for secondary copy and low-priority metadata.

### Coral Soft

`rgba(255, 84, 112, 0.14)`

Use for sale states, warning surfaces and subtle Coral backgrounds.

### Lime Soft

`rgba(198, 255, 61, 0.12)`

Use for verified states and trust surfaces.

The brand should still visibly look like a **four-colour system**.

---

## 06. Typography

### Display

**Archivo Black / Archivo 900**

Use for:

- H1
- H2
- event names
- prices
- CTA buttons
- large numbers
- wordmark

Example:

> **SOLD OUT?**  
> **NOT ANYMORE.**

Use large scale and tight spacing.

### Utility / Ticket Type

**IBM Plex Mono**

Use for:

- ticket IDs
- dates
- venue information
- timestamps
- verification states
- prices
- seller stats
- filters
- metadata

Example:

```text
AM-00482
14 SEP 2026 · 21:00
GENERAL ADMISSION
SELLER 4.92 ★
PROVIDER VERIFIED
```

The mono font creates the **inventory / ticket / catalogue / transaction** side of the identity.

### Body Typography

Recommended:

- **Inter**
- or **IBM Plex Sans**

Do not use monospaced type for long paragraphs.

Use:

- **Archivo** → character
- **IBM Plex Mono** → brand texture
- **Inter / Plex Sans** → readability

---

## 07. Type Hierarchy

Recommended desktop sizing:

| Role | Font | Size |
|---|---|---|
| Hero Heading | Archivo 900 | `72–96px` |
| Page Title | Archivo 900 | `48–64px` |
| Section Heading | Archivo 800 | `32–40px` |
| Card Heading | Archivo 700 | `20–24px` |
| Body | Inter / Plex Sans | `15–18px` |
| Metadata | IBM Plex Mono | `11–14px` |

Suggested heading tracking:

```css
letter-spacing: -0.03em;
```

Suggested mono-label tracking:

```css
letter-spacing: 0.06em;
```

---

## 08. Site Vibe

The website should feel like:

> **A digital event poster wall crossed with a trusted marketplace.**

Avoid:

- generic Ticketmaster-style design
- banking dashboards
- SaaS card grids
- startup gradients everywhere
- overly polished corporate fintech visuals

Aim for:

**Cape Town nightlife flyer  
+ record shop catalogue  
+ StockX transaction logic  
+ digital ticket stub  
+ underground event poster**

---

## 09. Layout Language

Use strong modular blocks.

### Recommended Structure

- 12-column desktop grid
- large whitespace
- oversized event imagery
- hard-edged rectangular cards
- occasional ticket notches
- rounded corners, but not everywhere

Recommended corner radii:

```text
Cards:   16–20px
Buttons: 10–14px
Pills:   999px
Tickets: Custom notch geometry
```

---

## 10. Ticket Motif

The ticket should become one of the strongest visual devices in the brand.

Example event card:

```text
┌─────────────────────────────◖
│  AM-00541
│
│  KYLE WATSON
│  DISTRICT
│
│  SAT 18 OCT
│
│          FROM R350
└─────────────────────────────◗
```

Use ticket notches on:

- event cards
- checkout screens
- QR displays
- listing cards
- profile achievements
- notification panels

---

## 11. Graphic Language

### 01 — Arrows ↔

Represents:

- buyer ↔ seller
- ticket ↔ money
- old owner ↔ new owner

Use oversized arrows as background graphics and motion devices.

### 02 — Ticket Perforations

```text
● ● ● ● ●
```

Use vertical dotted lines as dividers and decorative details.

### 03 — Verification Stamps

Examples:

```text
VERIFIED
SECURE
TRANSFERRED
IN ESCROW
```

Use Lime for positive trust states.

### 04 — Catalogue Labels

Example:

```text
AM-CPT-00291
CATEGORY: NIGHTLIFE
STATUS: VERIFIED
LISTED 04 SEP 26
```

This reinforces the receipt / stock / catalogue feel.

---

## 12. Pattern System

### AFTERMARKET GRID

Thin Ink / Cream grid.

Use behind:

- hero sections
- profile headers
- loading screens

### VERIFIED DOT

Repeating Lime dots.

Use around:

- verified listings
- successful purchases
- seller trust areas

### RESALE STRIPE

45° Coral lines.

Use around:

- sale sections
- sell-ticket pages
- alerts

### PERFORATION

Repeating circular holes.

Use for:

- section separators
- cards
- ticket UI

---

## 13. Photography

Photography should feel:

- flash-heavy
- grainy
- nighttime
- energetic
- candid
- local
- imperfect

Subjects:

- crowds
- stage lighting
- Cape Town venues
- motion blur
- DJ booths
- festivals
- sunset events
- venue entrances

Avoid sterile stock photography.

It should look like the images came from:

- someone's camera roll
- an event photographer
- a disposable film camera

---

## 14. Image Treatment

Apply brand overlays to photography.

Recommended:

- Ink overlay at `20–45%`
- occasional Coral duotone treatment
- Cream typography over images
- Lime used sparingly over photos

Images can also sit inside large ticket-shaped masks.

---

## 15. Buttons

### Primary Purchase

- Background: Lime
- Text: Ink

```text
BUY TICKET →
```

### Primary Sell Action

- Background: Coral
- Text: Ink

```text
SELL TICKET →
```

This creates an intuitive brand language:

- **Lime** → buy / safe / available
- **Coral** → sell / action / list

### Secondary

- Ink or transparent background
- Cream border
- Cream text

Example:

```text
VIEW EVENT
```

---

## 16. Status System

### VERIFIED

Lime

```text
✓ PROVIDER VERIFIED
```

### FUNDS HELD

Cream / Ink

```text
● MONEY IN ESCROW
```

### TRANSFERRING

Coral

```text
↔ TRANSFER IN PROGRESS
```

### SOLD

Ink

```text
SOLD
```

### REFUNDED

Cream

```text
↶ REFUNDED
```

### UNVERIFIED

Do **not** use Lime.

Use Coral / Cream warning treatment.

The difference between verified tickets and seller-uploaded tickets should be obvious at a glance.

---

## 17. Event Cards

Standard event card:

```text
┌────────────────────────────────┐
│                                │
│        EVENT IMAGE             │
│                                │
├────────────────────────────────┤
│  NIGHTLIFE                     │
│                                │
│  BLACK COFFEE                  │
│                                │
│  18 OCT · CPT                  │
│                                │
│  FROM R450              →      │
└────────────────────────────────┘
```

Aftermarket resale listing:

```text
AM-02819

BLACK COFFEE
GENERAL ADMISSION

ORIGINAL      R550
RESALE        R450

✓ PROVIDER VERIFIED

[ BUY TICKET → ]
```

The catalogue-style presentation should clearly differentiate Aftermarket from generic event discovery apps.

---

## 18. Hero Direction

Suggested homepage hero:

# SOLD OUT  
# DOESN'T MEAN  
# YOU'RE OUT.

Supporting line:

> Buy and resell event tickets securely. Your money doesn't move until the ticket does.

CTA pair:

```text
FIND TICKETS →
SELL A TICKET ↗
```

Use the primary logo mark oversized beside or behind the hero.

---

## 19. Motion

Motion should communicate **transfer**.

Good motion:

- ↔ sliding
- ticket passing left → right
- verification stamp appearing
- perforation tearing
- arrows rotating
- status ticks
- cards stacking
- QR expanding

Avoid:

- random floating blobs
- generic SaaS gradients
- excessive bouncing

Animation should communicate something actually happening.

---

## 20. Icons

Icon language should match the logo:

- thick stroke
- rounded joins
- simple geometric silhouettes
- Ink outlines
- one accent colour

Suggested icon set:

- ticket
- lock
- verified
- wallet
- transfer arrows
- location
- calendar
- venue
- person
- QR
- heart
- friend
- seller
- notification

Icons should feel like pieces pulled directly from the primary mark.

---

## 21. Voice

The voice should be:

**Direct. Plain. Confident. No hype-speak.**

Avoid:

> Experience the ultimate revolution in ticket resale!

Prefer:

> **Someone can't go. You still can.**

Avoid:

> Secure payment protection ensures peace of mind.

Prefer:

> **We hold the money until the ticket is yours.**

Avoid:

> Begin selling your ticket today.

Prefer:

> **Can't make it? Sell your ticket.**

---

## 22. Brand Phrases

Possible recurring brand lines:

- **SOLD OUT ≠ OVER**
- **THE TICKET MOVES. THEN THE MONEY DOES.**
- **GET IN.**
- **CAN'T GO? PASS IT ON.**
- **SOLD OUT IS JUST THE AFTERMARKET.**
- **YOUR NEXT NIGHT OUT IS ALREADY SOMEONE ELSE'S SPARE TICKET.**
- **BUY FROM PEOPLE. NOT SCREENSHOTS.**
- **VERIFIED BEFORE PAID.**

---

## 23. Core Brand Rule

The identity should always balance two sides:

### NIGHT

- Coral
- big type
- event photography
- movement
- bold graphics

### TRUST

- Ink
- Cream
- mono type
- verification
- structured tickets
- clear transaction states

That balance is what makes **AFTERMARKET** feel like a proper event marketplace brand rather than another generic ticketing platform.

---

## Quick Reference

```text
PRIMARY LOGO
AM Exchange Ticket Mark

SECONDARY LOGO
Circular Ticket Exchange Mark

WORDMARK
AFTERMARKET.

PRIMARY BACKGROUND
#14102B — Shop Floor Ink

PRIMARY CTA / SELL
#FF5470 — Resale Coral

TRUST / VERIFIED / BUY
#C6FF3D — Verified Lime

TEXT / TICKET STOCK
#F5F0E6 — Stock Cream

DISPLAY FONT
Archivo 900

UTILITY FONT
IBM Plex Mono

BODY FONT
Inter / IBM Plex Sans
```

---

**AFTERMARKET.**  
*Tickets change hands. Money stays safe.*
