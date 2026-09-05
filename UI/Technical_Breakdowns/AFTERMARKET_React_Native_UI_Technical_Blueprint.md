Yes. The cleanest way to build these is as **one shared React Native design system with four screen compositions**, rather than four independently styled pages.

Below is the blueprint I would hand to a frontend developer if the goal were:

> **“Reproduce the four AFTERMARKET mobile mockups as closely as possible in React Native, while keeping the same components usable for a mobile website through React Native Web.”**

I’m basing this specifically around the **light-mode mockups you just generated**, using the existing AFTERMARKET palette:

```ts
INK   = '#14102B'
CORAL = '#FF5470'
LIME  = '#C6FF3D'
CREAM = '#F5F0E6'
```

The overall visual system in your brand document already establishes Cream as the light/paper surface, Ink as the structural colour, Coral as the energetic CTA colour, and Lime as the verification/trust signal.

---

# AFTERMARKET MOBILE UI — TECHNICAL BLUEPRINT

# 1. Overall architecture

Build the interface as:

```text
App
└── NavigationContainer
    └── MainTabs
        ├── HomeScreen
        ├── SearchScreen
        ├── TicketsScreen
        └── ProfileScreen
```

For React Native:

```text
React Native
Expo
TypeScript
React Navigation
React Native Safe Area Context
React Native Reanimated
Expo Image
Lucide React Native / custom SVG icons
```

For web compatibility:

```text
react-native-web
Expo Router OR React Navigation
CSS-like RN StyleSheet
responsive maxWidth container
```

The same JSX should ideally render on:

```text
iOS
Android
mobile web
desktop web in a centered mobile-width shell
```

---

# 2. Design baseline

Design around this logical viewport:

```ts
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
```

That roughly corresponds to a modern iPhone viewport.

Do **not** position everything with absolute coordinates.

Instead, reproduce the mockups using:

```text
SafeArea
+
vertical document flow
+
fixed horizontal gutters
+
fixed component heights
+
responsive widths
```

That way the layout still works on:

```text
320px small phones
375px iPhones
390–430px modern phones
mobile browsers
tablet portrait
desktop web
```

---

# 3. Global responsive shell

Every screen should sit inside:

```tsx
<SafeAreaView style={styles.root}>
  <View style={styles.screen}>
    ...
  </View>
</SafeAreaView>
```

Base structure:

```ts
root: {
  flex: 1,
  backgroundColor: colors.cream,
},

screen: {
  flex: 1,
  backgroundColor: colors.cream,
},

content: {
  width: '100%',
  maxWidth: 430,
  alignSelf: 'center',
},
```

For desktop web:

```text
browser background
        ↓
#14102B / muted neutral

        centered

┌──────────────────────┐
│  393–430px app shell │
│                      │
│                      │
└──────────────────────┘
```

You should **not** stretch the mobile interface across a 1400px desktop monitor.

Instead:

```ts
maxWidth: 430
```

preserves the intended mobile composition.

---

# 4. Global spacing system

Avoid random values.

Use a consistent scale.

```ts
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};
```

Primary page gutter:

```ts
paddingHorizontal: 20
```

For larger devices:

```ts
paddingHorizontal: 24
```

Use:

```text
20px → standard phone
24px → larger phone
```

---

# 5. Colour tokens

```ts
export const colors = {
  ink: '#14102B',
  coral: '#FF5470',
  lime: '#C6FF3D',
  cream: '#F5F0E6',

  surface: '#FFFDF8',
  surfaceRaised: '#FFFFFF',

  textPrimary: '#14102B',
  textSecondary: '#6F6A78',
  textMuted: '#9993A0',

  border: 'rgba(20,16,43,0.14)',
  borderStrong: 'rgba(20,16,43,0.28)',

  coralSoft: 'rgba(255,84,112,0.12)',
  limeSoft: 'rgba(198,255,61,0.16)',

  overlay: 'rgba(20,16,43,0.48)',
};
```

Do not introduce blue as a UI accent.

Do not introduce generic success green.

Use:

```text
Coral = action
Lime = verification
Ink = structure
Cream = environment
```

---

# 6. Typography

The brand already specifies Archivo 900 for display and IBM Plex Mono for catalogue-like data.

Use three text roles.

## Display

```text
Archivo Black / Archivo 900
```

For:

```text
Page titles
Hero text
Event names
Section headings
Prices
```

## Utility

```text
IBM Plex Mono
```

For:

```text
Ticket IDs
Dates
Status
Prices
Venue metadata
```

## Interface/body

Use:

```text
Inter
```

or:

```text
IBM Plex Sans
```

---

# 7. Type tokens

```ts
const type = {
  hero: {
    fontFamily: 'Archivo_900Black',
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: -1.4,
  },

  pageTitle: {
    fontFamily: 'Archivo_900Black',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
  },

  sectionTitle: {
    fontFamily: 'Archivo_800ExtraBold',
    fontSize: 23,
    lineHeight: 28,
  },

  cardTitle: {
    fontFamily: 'Archivo_800ExtraBold',
    fontSize: 21,
    lineHeight: 25,
  },

  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },

  bodyStrong: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  },

  mono: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
};
```

---

# 8. Shared bottom navigation

All four pages use the same bottom navigation.

Visually:

```text
┌──────────────────────────────────────┐
│                                      │
│   🏠          🔍         🎟         ◯ │
│  Home       Search     Tickets    Profile
│                                      │
└──────────────────────────────────────┘
```

Recommended height:

```ts
height: 78
```

Plus safe-area bottom inset.

Component:

```tsx
<AppTabBar
  active="home"
/>
```

Each item:

```tsx
<TabItem
  icon={HomeIcon}
  label="Home"
  active={active === 'home'}
/>
```

Active:

```text
icon = Coral
label = Coral
```

Inactive:

```text
icon = Ink at ~65%
label = Ink at ~65%
```

Do not use a filled black navigation bar in the light theme.

Use:

```ts
backgroundColor: colors.cream
borderTopColor: colors.border
```

Ideally:

```text
position: absolute
bottom: 0
```

or React Navigation's tab navigator.

Then give scrolling pages:

```ts
paddingBottom: TAB_BAR_HEIGHT + 24
```

---

# 9. Shared page header behavior

The page content should begin below:

```text
safe-area top
+
approximately 16px
```

Typical structure:

```tsx
<View style={styles.header}>
   ...
</View>
```

No traditional navbar.

The mockups rely on:

```text
large typography
minimal chrome
content-first design
```

---

# PAGE 1 — HOME / DISCOVER

# 10. Home screen visual hierarchy

The exact vertical layout should be:

```text
SAFE AREA
│
├── Brand mark + Cape Town selector
│
├── Hero heading
│
├── Supporting copy
│
├── Search field
│
├── Location / Date / Filter row
│
├── Category horizontal chips
│
├── Section title: Featured events
│
├── Large event card
│
├── Event card
│
├── More events
│
└── Bottom navigation
```

React tree:

```tsx
<HomeScreen>
  <SafeAreaView>
    <ScrollView>
      <ScreenContainer>

        <HomeTopBar />

        <HeroBlock />

        <DiscoverSearch />

        <DiscoverFilterRow />

        <CategoryScroller />

        <SectionHeader />

        <FeaturedEventCard />

        <EventFeed />

      </ScreenContainer>
    </ScrollView>

    <AppTabBar />
  </SafeAreaView>
</HomeScreen>
```

---

# 11. Home top bar

Mockup:

```text
AM                              CAPE TOWN⌄
```

Height:

```text
48–56px
```

Structure:

```tsx
<View style={styles.topBar}>
  <BrandMark />
  <Pressable style={styles.locationTrigger}>
    <Text>CAPE TOWN</Text>
    <ChevronDown />
  </Pressable>
</View>
```

Recommended styling:

```ts
topBar: {
  height: 52,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
```

Brand mark:

```text
36–42px tall
```

Cape Town:

```text
Archivo 700
12–13px
uppercase
```

---

# 12. Home hero block

Mockup structure:

```text
SOLD OUT
DOESN'T MEAN
YOU'RE OUT.

Buy and resell event tickets securely.
Your money doesn't move until the ticket does.
```

Use exactly three visual lines.

Component:

```tsx
<View style={styles.hero}>
  <Text style={styles.heroTitle}>
    SOLD OUT{'\n'}
    DOESN'T MEAN{'\n'}
    YOU'RE OUT.
  </Text>

  <Text style={styles.heroBody}>
    Buy and resell event tickets securely.
    {'\n'}
    Your money doesn't move until the ticket does.
  </Text>
</View>
```

Spacing:

```text
top → 14
title → 18
body → 28
```

Hero should dominate upper fold.

---

# 13. Home search bar

Dimensions:

```text
height: 58–64px
width: full
radius: 20–24px
```

Structure:

```text
🔍  Search events, venues, organisers...       ×
```

Component:

```tsx
<Pressable style={styles.searchInput}>
  <Search size={24} color={colors.coral} />

  <Text style={styles.searchPlaceholder}>
    Search events, venues, organisers...
  </Text>

  <View style={styles.searchClear}>
    <X />
  </View>
</Pressable>
```

Use Pressable rather than actual TextInput if tapping it simply navigates to Search.

---

# 14. Filter row

Immediately under search:

```text
┌──────────────┐ ┌─────────────┐ ┌──────┐
│ ◉ Cape Town  │ │▣ Any date ▾ │ │ sliders │
└──────────────┘ └─────────────┘ └──────┘
```

Container:

```tsx
<View style={styles.filterRow}>
```

Widths:

```text
Location = approximately 40%
Date = approximately 40%
Filter = approximately 15%
Gap = approximately 8px
```

React:

```tsx
<FilterButton
  icon={MapPin}
  label="Cape Town"
/>

<FilterButton
  icon={Calendar}
  label="Any date"
  chevron
/>

<IconFilterButton icon={SlidersHorizontal} />
```

Height:

```text
52–56px
```

---

# 15. Category chips

Horizontal scrolling:

```text
All events
Nightlife
Festivals
Live music
Daylife
```

Component:

```tsx
<FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={categories}
  contentContainerStyle={styles.categoryRow}
  renderItem={...}
/>
```

Active:

```text
background = Coral
text = Ink
```

Inactive:

```text
background = transparent
border = Ink / 14%
```

Chip:

```ts
height: 40
paddingHorizontal: 16
borderRadius: 999
```

---

# 16. Featured events heading

```text
Featured events                          See all →
```

React:

```tsx
<SectionHeader
  title="Featured events"
  action="See all"
/>
```

Spacing before:

```text
30–34px
```

---

# 17. Main event card

The event card is one of the most important components.

Approximate ratio:

```text
width: 100%
image height: 230–260
metadata area: 100–120
```

Structure:

```text
┌────────────────────────────────┐
│                                │
│            IMAGE               │
│                             ♡  │
│                                │
├────────┬───────────────────────┤
│ SAT    │ Black Coffee          │
│ 18     │ The Ostrich · CPT     │
│ OCT    │ Electronic Nightlife │
└────────┴───────────────────────┘
```

React:

```tsx
<EventCard>
  <View style={styles.imageWrapper}>
    <Image />

    <Pressable style={styles.favoriteButton}>
      <Heart />
    </Pressable>
  </View>

  <View style={styles.eventMeta}>
    <EventDateBadge />

    <View style={styles.eventInfo}>
      <Text style={styles.eventTitle}>
        Black Coffee
      </Text>

      <Text style={styles.eventVenue}>
        The Ostrich · Cape Town
      </Text>

      <TagRow />
    </View>
  </View>
</EventCard>
```

Card:

```ts
borderRadius: 18
overflow: 'hidden'
borderWidth: 1
borderColor: colors.border
```

---

# 18. Date block

Example:

```text
SAT
18
OCT
```

Width:

```text
72–82px
```

Use centered typography.

```tsx
<View style={styles.dateBadge}>
```

Big day number:

```text
Archivo 800
28px
```

---

# 19. Event cards below the first card

Do not repeat a giant card for every item.

Use a hierarchy:

```text
first card = hero card

subsequent cards = slightly shorter
```

For example:

```text
Hero → image 260px
Secondary → image 180px
```

This creates rhythm.

---

# 20. Event detail ticket availability

When opening an event, ticket types should conceptually render:

```text
GENERAL ADMISSION
R450

✓ Available on Aftermarket

or

Provider sale →

or

Notify me
```

State model:

```ts
type TicketAvailability =
  | 'provider'
  | 'aftermarket'
  | 'waitlist';
```

Render:

```tsx
switch (availability) {

  case 'aftermarket':
    return <AftermarketTicketCTA />;

  case 'provider':
    return <ProviderTicketCTA />;

  case 'waitlist':
    return <NotifyMeCTA />;
}
```

---

# 21. Seller ranking card

When Aftermarket tickets exist:

```text
SELLERS

★★★★★ 4.96
Kai M.
24 tickets sold
Provider verified

R450                BUY →
```

Rank:

```ts
sort(
  reputationScore DESC,
  ticketsSold DESC
)
```

UI should visibly prioritize:

```text
rating
verification
sales history
```

rather than simply lowest price.

---

# PAGE 2 — SEARCH

# 22. Search screen structure

Exact composition:

```text
SAFE AREA

Search
Events, organisers, or venues.

[ Search field ]

[ All events ] [ Nightlife ] [ Festivals ] ...

Recent searches                         Clear all

◷ Keinemusik                               ×
◷ Cabo Beach Club                          ×
◷ Ultra South Africa                       ×
◷ The Jazz Room                            ×

Popular right now                    See all →

[img] Fisher                            ♡
      Grand Arena · Cape Town
      Sat 26 Oct 2024

...

BOTTOM NAV
```

Component tree:

```tsx
<SearchScreen>
  <SafeAreaView>
    <ScrollView>

      <PageHeading />

      <SearchInput />

      <CategoryScroller />

      <RecentSearchSection />

      <PopularEventsSection />

    </ScrollView>

    <AppTabBar active="search" />
  </SafeAreaView>
</SearchScreen>
```

---

# 23. Search header

```tsx
<View style={styles.searchHeader}>
  <Text style={styles.pageTitle}>
    Search
  </Text>

  <Text style={styles.pageSubtitle}>
    Events, organisers, or venues.
  </Text>
</View>
```

Spacing:

```text
title → subtitle: 3–5px
subtitle → input: 28px
```

---

# 24. Search input

The actual Search screen uses a taller focused input.

```text
height ≈ 60
borderRadius ≈ 30
```

Layout:

```text
🔍    Type to search...                ×
```

React:

```tsx
<View style={styles.searchBox}>
  <Search color={colors.coral} />

  <TextInput
    value={query}
    onChangeText={setQuery}
    placeholder="Type to search..."
  />

  {query.length > 0 && (
    <Pressable onPress={() => setQuery('')}>
      <X />
    </Pressable>
  )}
</View>
```

---

# 25. Live search behavior

Debounce:

```text
250–350ms
```

Search entities:

```text
event title
organiser
venue
location
```

State:

```ts
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [isSearching, setSearching] = useState(false);
```

When query:

```text
0 chars → discovery state
1–2 chars → optional idle
3+ chars → search
```

---

# 26. Recent searches

Header:

```text
Recent searches                    Clear all
```

Row:

```tsx
<RecentSearchRow>
  <Clock3 />
  <Text>Keinemusik</Text>
  <X />
</RecentSearchRow>
```

Height:

```text
50–52px
```

Do not place rows inside visible cards.

They should feel like clean list rows on the Cream surface.

---

# 27. Popular right now

Compact list rather than cards.

Structure:

```text
[IMAGE] EVENT NAME                         HEART
        Venue · Cape Town
        Date
```

Image:

```text
76×76
radius 10
```

Row height:

```text
90–96px
```

Component:

```tsx
<CompactEventRow
  image=""
  title="Fisher"
  venue="Grand Arena · Cape Town"
  date="Sat 26 Oct 2024"
  favorite={false}
/>
```

---

# 28. Search states

You need at least four.

```text
1. Discovery
2. Searching
3. Results
4. No results
```

No results:

```text
NO RESULTS FOR
“SECRET PARTY”

Try another event, venue or organiser.
```

Keep it minimal.

---

# PAGE 3 — MY TICKETS

# 29. Tickets screen structure

Exact hierarchy:

```text
SAFE AREA

My Tickets

Upcoming (3)              Past (5)
────────────

[ hero image ]
   [ TICKET STUB ]

[ hero image ]
   [ TICKET STUB ]

[ hero image ]
   [ TICKET STUB ]

BOTTOM NAV
```

React:

```tsx
<TicketsScreen>
  <SafeAreaView>

    <TicketsHeader />

    <TicketTabs />

    <FlatList
      data={tickets}
      renderItem={renderTicket}
    />

    <AppTabBar active="tickets" />

  </SafeAreaView>
</TicketsScreen>
```

Use FlatList instead of ScrollView because tickets could become numerous.

---

# 30. Tickets header

```text
My Tickets
```

Use:

```text
Archivo 900
36–40px
```

Margin:

```text
horizontal 20
top 16
bottom 24
```

---

# 31. Upcoming / Past segmented tabs

Not pills.

Use a traditional underline treatment.

```text
Upcoming (3)                    Past (5)
──────────────
```

Component:

```tsx
<View style={styles.tabs}>
  <TicketTab
    active
    label="Upcoming (3)"
  />

  <TicketTab
    label="Past (5)"
  />
</View>
```

Bottom border:

```text
1px neutral
```

Active indicator:

```text
Coral
3px
```

---

# 32. Ticket card architecture

Each ticket consists of TWO layers:

```text
background = event photography

foreground = ticket stub
```

Important.

Do not simply make the entire card one coloured rectangle.

Structure:

```tsx
<TicketCard>
  <ImageBackground
    source={hero}
    style={styles.ticketHero}
  >

    <View style={styles.imageOverlay} />

    <TicketStub ticket={ticket} />

  </ImageBackground>
</TicketCard>
```

Outer dimensions:

```text
height 200–220px
borderRadius 18px
```

---

# 33. Ticket stub

The actual ticket sits inset:

```text
left 70–80px
right 0–10px
top 22–28px
bottom 22–28px
```

This lets the event image remain visible on the left.

Structure:

```text
┌───────────────────────────────────────◖
│ AM-02819                 │             │
│                          │             │
│ BLACK COFFEE             │     QR      │
│ GENERAL ADMISSION        │             │
│                          │             │
│ The Ostrich · Cape Town  │             │
│ Sat 18 Oct · 18:00       │             │
└───────────────────────────────────────◗
```

---

# 34. Ticket perforation

Do not fake ticket geometry with an image if you want scalability.

Build the stub from Views/SVG.

Recommended:

```tsx
<Svg>
  <Path d="..." />
</Svg>
```

Or:

```text
View
+
absolute notch circles
```

Example:

```tsx
<View style={styles.ticket}>
  <View style={styles.topNotch} />
  <View style={styles.bottomNotch} />
  <View style={styles.rightNotch} />

  <TicketContent />

  <PerforationLine />

  <QRCode />
</View>
```

---

# 35. Ticket variants

Variant 1:

```text
General admission
background = Coral
text = Ink
```

Variant 2:

```text
VIP
background = Ink
primary text = Lime
secondary text = Cream
```

Variant 3:

```text
Verified
background = Cream
text = Ink
```

Variant 4:

```text
Escrow / secure
background = Lime
text = Ink
```

These variants mirror the visual ticket system already established in the brand board.

Data:

```ts
type TicketVariant =
  | 'general'
  | 'vip'
  | 'verified'
  | 'escrow';
```

Then:

```ts
const ticketTheme = {
  general: {
    background: colors.coral,
    text: colors.ink,
  },

  vip: {
    background: colors.ink,
    text: colors.lime,
  },

  verified: {
    background: colors.cream,
    text: colors.ink,
  },

  escrow: {
    background: colors.lime,
    text: colors.ink,
  },
};
```

---

# 36. Ticket text

Use mono heavily here.

```text
AM-02819

BLACK COFFEE
GENERAL ADMISSION

The Ostrich · Cape Town
Sat 18 Oct 2024 · 18:00
```

Recommended:

```text
ID → IBM Plex Mono 12
Event → Archivo 800 20
Ticket type → IBM Plex Mono 13–14
Venue → IBM Plex Mono 12
Date → IBM Plex Mono 12
```

---

# 37. QR area

Right-hand stub width:

```text
95–110px
```

Vertical dotted line:

```text
2px
Ink / 80%
```

QR:

```text
54–64px
```

Do not let the QR dominate the ticket.

---

# 38. Past tickets

The Past tab uses the same component but reduced emphasis.

Suggested:

```text
opacity event image → 60%
ticket → Cream / muted
status chip → USED
```

Do not radically redesign the card.

---

# PAGE 4 — PROFILE

# 39. Profile composition

Profile has the most complex hierarchy.

Exact structure:

```text
HERO / BANNER
  back    edit    settings

PROFILE PHOTO

Username
Member since

🇿🇦     Following     Followers

Events attended        Tickets sold

[ ADD FRIENDS ] [ QR ] [ LINK ]

Following                   See all →

[ circular organisers ]

Badges                      See all →

[ badge ][ badge ][ badge ][ badge ]

BOTTOM NAV
```

Component tree:

```tsx
<ProfileScreen>
  <SafeAreaView>

    <ScrollView>

      <ProfileHero />

      <ProfileIdentity />

      <ProfileSocialStats />

      <ProfileActivityStats />

      <ProfileActions />

      <FollowingSection />

      <BadgesSection />

    </ScrollView>

    <AppTabBar active="profile" />

  </SafeAreaView>
</ProfileScreen>
```

---

# 40. Profile banner

Height:

```text
220–250px
```

Image:

```text
Cape Town
venue photography
event imagery
personal cover
```

```tsx
<ImageBackground
  source={banner}
  style={styles.banner}
>
```

Buttons:

```text
back left

edit + settings right
```

All circular.

Size:

```text
44–48px
```

Style:

```ts
backgroundColor: 'rgba(245,240,230,0.78)'
```

Optionally blur with BlurView.

---

# 41. Profile avatar

Overlaps banner.

```text
size 112–126px
```

Position:

```text
marginTop: -58
```

or absolute:

```ts
position: 'absolute',
top: bannerHeight - 62
```

Border:

```text
4px Cream
```

Round:

```text
borderRadius: 999
```

---

# 42. Profile identity

To the right / below avatar:

```text
kai.m
Member since Mar 2024
```

On narrow widths, ensure it wraps underneath correctly.

Use flex:

```tsx
<View style={styles.identityRow}>

  <Avatar />

  <View style={styles.identityText}>
    ...
  </View>

</View>
```

---

# 43. Followers block

Layout:

```text
🇿🇦          342             1.2K
             Following       Followers
```

Use vertical divider.

```tsx
<View style={styles.socialStats}>
```

Each number:

```text
Archivo 800
22–24px
```

Labels:

```text
Inter
13px
muted
```

Both Following and Followers are Pressable.

---

# 44. Activity stats

Row:

```text
🎟 18                           🏷 11
   Events attended                 Tickets sold
```

Each half:

```text
50% width
```

Optional center divider.

Component:

```tsx
<StatCard
  icon={Ticket}
  value={18}
  label="Events attended"
/>
```

No heavy card background.

Let the layout breathe.

---

# 45. Profile action row

The mockup uses:

```text
┌──────────────────────┐ ┌──────┐ ┌──────┐
│   👥 Add friends     │ │  QR  │ │ LINK │
└──────────────────────┘ └──────┘ └──────┘
```

Recommended widths:

```text
Add Friends → flex 1
QR → 72px
Link → 64px
```

Button height:

```text
58–62px
```

Primary:

```text
Coral
```

Although Lime can indicate verified state, Coral remains the main interaction CTA.

---

# 46. QR identity block

QR button can contain QR only.

Under the QR:

```text
AM
AFTERMARKET.
```

or display the logo in an expanded modal.

Tap interaction:

```text
Press QR
↓
bottom sheet
↓
large profile QR
↓
username
↓
copy/share
```

---

# 47. Following organisers / venues

Horizontal FlatList.

```tsx
<FlatList
  horizontal
  data={following}
  showsHorizontalScrollIndicator={false}
/>
```

Each item:

```text
[ circular image ]
     Cabo
```

Image:

```text
68–76px
```

Spacing:

```text
14–18px
```

Text max width:

```text
76px
```

Centered.

---

# 48. Badge grid

Four visible horizontally.

Example:

```text
┌──────────┐
│   🎟     │
│          │
│ First    │
│ Event    │
└──────────┘
```

Use:

```text
4 cards across
```

For 393px viewport:

```text
page width ≈ 353
gaps ≈ 8×3
card width ≈ 82
```

Component:

```tsx
<BadgeCard
  icon={Ticket}
  label="First Event"
/>
```

Rounded:

```text
14px
```

Background:

```text
white / Cream elevated
```

---

# 49. Badge colour semantics

Do not randomize colours.

Use brand meaning.

Example:

```text
First Event
Coral

First Ticket Sold
Lime

Venue Hopper
Ink

Double Booker
Coral/Lime accent
```

---

# 50. Bottom spacing on Profile

Because the profile is long:

```text
contentPaddingBottom =
tabBarHeight
+
safeAreaBottom
+
32
```

Otherwise the final badges will sit behind the tab bar.

---

# 51. Shared reusable components

Your UI library should roughly contain:

```text
/components

AppShell
ScreenContainer
AppTabBar

BrandMark
PageTitle
SectionHeader

SearchField
FilterButton
CategoryChip

EventCard
CompactEventRow
EventDateBadge
EventTag

TicketCard
TicketStub
TicketPerforation
QRCodeView

Avatar
ProfileStat
ProfileAction
FollowCircle
BadgeCard

IconButton
PrimaryButton
SecondaryButton

EmptyState
LoadingSkeleton
```

The pages should largely be **composition**, not custom styling from scratch.

---

# 52. Suggested project structure

```text
src/

  components/

    common/
      AppTabBar.tsx
      ScreenContainer.tsx
      IconButton.tsx
      SectionHeader.tsx

    discovery/
      SearchField.tsx
      FilterButton.tsx
      CategoryChip.tsx
      EventCard.tsx
      CompactEventRow.tsx

    tickets/
      TicketCard.tsx
      TicketStub.tsx
      TicketPerforation.tsx

    profile/
      ProfileHero.tsx
      ProfileStats.tsx
      FollowCircle.tsx
      BadgeCard.tsx

  screens/
    HomeScreen.tsx
    SearchScreen.tsx
    TicketsScreen.tsx
    ProfileScreen.tsx

  navigation/
    MainTabs.tsx

  theme/
    colors.ts
    typography.ts
    spacing.ts
    radius.ts

  data/
    mockEvents.ts
    mockTickets.ts
    mockProfile.ts

  types/
    event.ts
    ticket.ts
    user.ts

  assets/
    logos/
    tickets/
    icons/
    event-images/
```

---

# 53. Example shared page wrapper

```tsx
export function Screen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.outer}>
        <View style={styles.inner}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },

  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
});
```

That single component is what makes the application usable as both:

```text
native app
and
mobile website
```

---

# 54. Home screen code blueprint

Not complete production code, but the composition should resemble this almost exactly:

```tsx
export function HomeScreen() {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.page}>

          <HomeTopBar />

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              SOLD OUT{'\n'}
              DOESN'T MEAN{'\n'}
              YOU'RE OUT.
            </Text>

            <Text style={styles.heroText}>
              Buy and resell event tickets securely.{'\n'}
              Your money doesn't move until the ticket does.
            </Text>
          </View>

          <SearchField />

          <View style={styles.filters}>
            <FilterButton
              icon={MapPin}
              label="Cape Town"
            />

            <FilterButton
              icon={CalendarDays}
              label="Any date"
              chevron
            />

            <FilterIconButton />
          </View>

          <CategoryScroller />

          <SectionHeader
            title="Featured events"
            action="See all"
          />

          <EventCard
            featured
            event={events[0]}
          />

          {events.slice(1).map(event => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}

        </View>
      </ScrollView>

      <AppTabBar active="home" />
    </Screen>
  );
}
```

---

# 55. Search screen blueprint

```tsx
export function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.page}>

          <Text style={styles.title}>
            Search
          </Text>

          <Text style={styles.subtitle}>
            Events, organisers, or venues.
          </Text>

          <SearchInput
            value={query}
            onChangeText={setQuery}
          />

          <CategoryScroller />

          {query.length === 0 ? (
            <>
              <RecentSearches />
              <PopularEvents />
            </>
          ) : (
            <SearchResults query={query} />
          )}

        </View>
      </ScrollView>

      <AppTabBar active="search" />
    </Screen>
  );
}
```

---

# 56. Tickets screen blueprint

```tsx
export function TicketsScreen() {
  const [tab, setTab] =
    useState<'upcoming' | 'past'>('upcoming');

  const visibleTickets =
    tab === 'upcoming'
      ? upcomingTickets
      : pastTickets;

  return (
    <Screen>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>
          My Tickets
        </Text>
      </View>

      <TicketTabs
        active={tab}
        onChange={setTab}
      />

      <FlatList
        data={visibleTickets}
        renderItem={({ item }) => (
          <TicketCard ticket={item} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ticketList}
      />

      <AppTabBar active="tickets" />

    </Screen>
  );
}
```

---

# 57. Profile screen blueprint

```tsx
export function ProfileScreen() {
  return (
    <Screen>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileScroll}
      >

        <ProfileHero
          banner={user.banner}
          avatar={user.avatar}
        />

        <View style={styles.profileBody}>

          <ProfileIdentity
            username="kai.m"
            memberSince="Mar 2024"
          />

          <ProfileSocialStats
            country="ZA"
            following={342}
            followers={1200}
          />

          <ProfileActivityStats
            events={18}
            sold={11}
          />

          <ProfileActions />

          <SectionHeader
            title="Following"
            action="See all"
          />

          <FollowingScroller />

          <SectionHeader
            title="Badges"
            action="See all"
          />

          <BadgeGrid />

        </View>

      </ScrollView>

      <AppTabBar active="profile" />

    </Screen>
  );
}
```

---

# 58. Mobile interaction design

All hit targets should be minimum:

```text
44×44px
```

Even if the visible icon is only:

```text
20–24px
```

For example:

```tsx
<Pressable
  hitSlop={10}
>
```

This matters heavily for:

```text
heart
back
gear
edit
clear search
share
filters
```

---

# 59. Touch feedback

Use:

```text
scale to 0.97
opacity to 0.85
```

on press.

Not dramatic bouncing.

Example with Reanimated:

```text
press in
↓
scale 0.97

press out
↓
spring 1
```

Duration:

```text
100–180ms
```

---

# 60. Screen transitions

Recommended:

```text
Tab switching → crossfade / no huge animation

Event card → slide from right

Profile modal → bottom sheet

Filters → bottom sheet

QR → bottom sheet

Ticket details → slide from right
```

Do not use excessive card zooming.

---

# 61. Filter UX

On Home, filters should open bottom sheets rather than new pages.

Example:

```text
Tap Cape Town

──────────────
LOCATION
Cape Town ✓
Stellenbosch
Anywhere

[ APPLY ]
──────────────
```

Date:

```text
Tonight
Tomorrow
This weekend
Choose date
Any date
```

Category filters update the feed immediately.

---

# 62. Web behavior

If rendered as a mobile website, preserve the exact mobile composition.

Desktop:

```text
██████████████████████████████
██                          ██
██      430PX APP VIEW      ██
██                          ██
██                          ██
██████████████████████████████
```

You can eventually build a separate desktop layout.

But for V1:

```css
max-width: 430px;
margin: 0 auto;
```

is completely valid.

---

# 63. Tablet behavior

Between approximately:

```text
600–900px
```

you can allow:

```text
maxWidth: 600
```

and change the event feed to:

```text
2 columns
```

But I would **not** do that initially.

Preserve the intended mobile experience first.

---

# 64. Loading states

Do not use generic spinners everywhere.

Use skeletons.

Home:

```text
████████████████
████████████

┌───────────────┐
│               │
│               │
└───────────────┘
```

Search:

```text
three list-row skeletons
```

Tickets:

```text
ticket stub skeleton
```

Profile:

```text
banner
avatar circle
stat lines
```

---

# 65. Empty states

## No tickets

```text
YOU'RE NOT IN YET.

Your upcoming tickets will live here.

[ FIND EVENTS ]
```

## No following

```text
FOLLOW THE PEOPLE
WHO MAKE THE NIGHT.

[ EXPLORE ORGANISERS ]
```

## No badges

```text
YOUR FIRST BADGE
STARTS WITH YOUR FIRST EVENT.
```

Maintain the direct brand voice.

The brand guide specifically defines the voice as direct and receipt-like rather than sales-heavy.

---

# 66. The most important visual rule

The app should **not** feel like four separate pages.

There should be one recognizable system:

```text
CREAM BACKGROUND

        +

INK TYPOGRAPHY

        +

CORAL INTERACTION

        +

LIME TRUST

        +

EVENT PHOTOGRAPHY

        +

TICKET GEOMETRY

        +

MONO METADATA
```

That combination is the product identity.

---

# 67. Exact screen visual hierarchy

If I condensed the entire frontend brief into four wireframes, they would be:

```text
HOME
────────────────────────
AM                 CPT ↓

SOLD OUT
DOESN'T MEAN
YOU'RE OUT.

description

[ SEARCH                    ]

[ LOCATION ][ DATE ][FILTER]

[ALL][NIGHT][FEST][LIVE]→

Featured events       See all

┌───────────────────────────┐
│         PHOTO             │
│                           │
│                      ♡    │
├──────┬────────────────────┤
│ DATE │ EVENT              │
│      │ VENUE              │
└──────┴────────────────────┘

more cards

────────────────────────────
HOME SEARCH TICKETS PROFILE
```

```text
SEARCH
────────────────────────

Search
Events, organisers, or venues.

[ 🔍 TYPE TO SEARCH       × ]

[ALL][NIGHT][FEST][LIVE]→

Recent searches      Clear all

◷ Search                         ×
◷ Search                         ×
◷ Search                         ×

Popular right now        See all

[IMG] Event                    ♡
      Venue
      Date

[IMG] Event                    ♡
      Venue
      Date

────────────────────────────
HOME SEARCH TICKETS PROFILE
```

```text
TICKETS
────────────────────────

My Tickets

UPCOMING (3)         PAST (5)
────────────

┌───────────────────────────┐
│ EVENT PHOTO               │
│   ┌─────────────────────◖ │
│   │ AM-02819      │ QR   │ │
│   │ EVENT         │      │ │
│   │ TYPE          │      │ │
│   │ VENUE         │      │ │
│   └─────────────────────◗ │
└───────────────────────────┘

┌───────────────────────────┐
│ VIP TICKET                │
└───────────────────────────┘

────────────────────────────
HOME SEARCH TICKETS PROFILE
```

```text
PROFILE
────────────────────────

┌────────────────────────────┐
│          BANNER      ✎ ⚙   │
│                            │
└────────────────────────────┘
   ◯ AVATAR

   kai.m
   Member since Mar 2024

   🇿🇦    342          1.2K
         Following    Followers

   🎟 18              🏷 11
   Events             Tickets sold

[      ADD FRIENDS     ][QR][↗]

Following                  See all

 ◯     ◯      ◯      ◯      ◯
Cabo Ostrich Ultra   Daisies ...

Badges                     See all

┌─────┐┌─────┐┌─────┐┌─────┐
│ 🎟  ││ ↗   ││ ✈  ││ ⚡  │
│First││First││Venue││Double
└─────┘└─────┘└─────┘└─────┘

────────────────────────────
HOME SEARCH TICKETS PROFILE
```

---

# 68. Final implementation philosophy

The React Native implementation should be built around **five core layers**:

```text
1. APP SHELL
Safe areas, navigation, max-width

2. BRAND SYSTEM
Colour, type, spacing, radius

3. PRIMITIVES
Buttons, chips, icons, inputs

4. PRODUCT COMPONENTS
Event card, ticket stub, profile stat

5. SCREENS
Home, Search, Tickets, Profile
```

Avoid building:

```tsx
HomeScreen.tsx = 1,200 lines
```

Instead Home should mostly read like:

```tsx
<HomeTopBar />
<Hero />
<Search />
<Filters />
<Categories />
<EventFeed />
```

The **screens control composition**.

The **components control appearance**.

The **theme controls the brand**.

That is the setup that will let you get extremely close to the mockups while still producing an app that is maintainable, responsive and reusable across React Native and React Native Web.
