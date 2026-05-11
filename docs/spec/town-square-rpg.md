# Aetherveil — Valley RPG Spec (v2)

**Status:** approved 2026-05-11. Source of truth.
**Replaces:** prior 3D TresJS spec (scrapped) + v1 town-square spec (single-screen, too small).
**Stack:** Nuxt 3.19.2 + **Phaser 3** (2D HTML5 game engine) + Tailwind 3.4 for HUD overlay, deployed static via GitHub Pages.

---

## §A Vision

**Single sentence:** A small mountain valley named **Aetherveil**, ~80×60 tiles of explorable land. Visitor arrives at the south, walks north toward the town square where **Mayor Halden** greets them — but the town is not the whole experience. The valley around it is the experience: cherry blossom groves, a waterfall feeding a river, an arched stone bridge, a residential lane of strange little houses, a clock tower with an underpass leading down to a beach with a fishing dock and a lighthouse beacon. Five themed buildings hold the craftsman's work, but the walk between them is the story.

**Reference vibes:**
- **Stardew Valley** — Pelican Town with its surrounding farms, river, beach, mines. The town is *one biome among many*.
- **Pokemon Gen 4 / Diamond** — Twinleaf Town → Route 201 → Sandgem Town: short walks reveal new vistas.
- **Harvest Moon: Magical Melody** — flower-fields, beach, mountain spring, all connected without map-edge teleports.
- **Studio Ghibli landscape painting** — cherry blossoms over a wooden bridge, a mill, a coastal cottage at sunset.

**Anti-patterns (forbidden):**
- Naming the website owner directly (Fatih).
- Building everything on one viewport-sized map. The visitor MUST walk.
- Map-edge "Loading…" transitions for outdoors (the whole valley is one tilemap; only building interiors fade-transition).
- Empty filler tiles. Every screen-worth of map needs at least one prop, NPC, or curiosity.
- Generic free-asset mashup (kept tightly to Kenney + a few hand-drawn additions).

**Visitor experience flow (revised):**
1. Page loads at `/`. Visitor sprite spawns at south-center of map (~row 56, col 40), facing north.
2. A small dialog tooltip appears: *"Welcome to Aetherveil. Arrow keys to walk."*
3. Visitor walks north along a stone path. River on the right, residential lane on the left. They pass a sign-post: *"AETHERVEIL · pop. quiet, mostly"*.
4. They reach Town Square. Mayor Halden walks two tiles forward, opens the dialog box: *"Ah, a new face! Welcome, traveler…"* Five-beat welcome tour mentions every region by name + direction.
5. Visitor regains control. Can walk anywhere — north to Atelier or Cherry Blossom Grove, east over the bridge to Embers' Forge, west to Vaults, south back to Inn / underpass / beach.
6. Each region has at least one **interactive curiosity**: a cat to pet, a meditation stone to sit at, a quest board to read, a fishing dock to cast at, a weird house to knock on.
7. The five portfolio buildings open into their own interior scenes (fade transition) where clickable content cards live (Pokemon-shop-style menu).
8. Game state (visited regions, fish caught, secrets found) persists to `localStorage`.

---

## §B Aetherveil Valley — World Map

### B.1 Scale

- World tilemap: **80 columns × 60 rows** of 32×32 px tiles → **2560 × 1920 px** world.
- Camera viewport: **800 × 480 px** (25 × 15 tiles visible). Camera follows player smoothly with deadzone.
- Walking the entire perimeter at base speed: ~45 seconds. The valley feels like a *place*, not a hub.
- Outdoors = single Phaser scene `AetherveilOverworld`. Interior buildings = separate scenes loaded on door-trigger.

### B.2 The valley — ASCII overview

```
                                                          N
                                                          |
                                                          v
 col:    0    5    10   15   20   25   30   35   40   45   50   55   60   65   70   75   80
        +----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
   row 0|TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT TTTT |   forest
      5 |TT~~ ~~~~ ~~~~ ~~~~ ~~~~ . .  . .  . .  . . .  . W W W  . . . . . . . . T |   ~ = cliff
        |T 7  CHERRY  BLOSSOM     . .  . .  . .  . . .  . W W W mist . . . . . . T |   W = waterfall
     10 |T 7  GROVE   (sakura)    . .  . .  . .  . . .  . W W W  -> river   . . T |
        |T 7  swing + meditation  . .  . .  . .  ::ATELIER::  R R . . . . . . . T |   :: = building
     15 |T 7  stone-of-quotes     . .  . .  . .  ::workshop::  R R . . . . . . . T |   R = river tile
        |T 7  petals falling      . . . pine ::  ::(door)  ::  R R . . . . . . . T |
     20 |T 7  hidden hermit       . . . trees..  . . . . .   R R::::: BRIDGE :::T |
        |T7   path -> south       . . . . . . .  ::QUEST    .  R R::::stone::::T |
     25 |T . . . . . . . . . . .  . . . . . . . ::BOARD::   .  R R . . ::EMBERS' T |
        |T . sign: "town square"  . . . . . . . . . . . . . . R R . . :: FORGE   T |
     30 |T . . . . . . . . . . .  . . . ___MARKET STALLS___ .  R R . . ::(door)::T |
        |T . . . ::VAULTS:: . . . . . | TOWN SQUARE      | .   R R . . ::      ::T |
     35 |T . . . ::OF      :: . . . . | FOUNTAIN  + MAYOR| .   R R . . . . . . . T |
        |T . . . ::WHISPER  :: . . .  | M = Mayor's spot |.    R R . . . . . . . T |
     40 |T . . . ::LEAF (door)::. . . |__________________| .   R R . . . . . . . T |
        |T . . . . . . . . . . . . . . . . . . . . . . . . .   R R . . . . . . . T |
     45 |T . CAT INV PNT HER MUS . . . . . . . . . . . . . . . R R . . . . . . . T |
        |T . [H] [H] [H] [H] [H] residential lane . . . . . .  R R . ::CLOCK::  T |
     50 |T . . . . . . . . . . . . . . . . . . . . . . . . . . R R . :: TOWER:: T |
        |T . . . . . . . . . . ::HEARTH:: ::WIND:: . . . . . . R R . ::(arch):: T |
     55 |T . . . . . . . . . . :: INN :: ::MILL:: . . . . . . . R R . under-pass T |
        |T . . . . . . . . . . :: (door)::          . . . . . . R~~~~~~~~~~~~~~T |   ~~ = sand
     58 |T . . . . . . . . . . . . . . [P] . . . . . SAND SAND SAND  ::BEACON:: T |   [P] = player spawn
        |T~ . . . . . . . . . . . . . . . . . . . . . sand ::DOCK:: ::lighthouse T |
     60 |T ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ sea sea sea sea sea sea sea T|
        +----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
                                                          ^
                                                          S
        Legend:
          T  = pine tree border (forest)
          ~  = cliff edge / sand-to-sea
          R  = river (flowing south)
          W  = waterfall
          :: = building wall
          .  = grass / path
          7  = cherry tree (pink)
          [H]= residential house
          [P]= player spawn
```

(ASCII is approximate; final tilemap will be precise. Treat this as a visual contract for placement, not pixel layout.)

### B.3 Regions overview (14 named places, west→east, north→south)

| # | Region | Location (col, row) | Vibe | Reward for visiting |
|---|--------|--------------------|------|---------------------|
| 1 | **Cherry Blossom Grove** | NW (col 0–18, row 5–22) | Pink sakura trees, falling petals (particle), wooden swing tied to one branch, meditation stone | Click meditation stone → philosophy quote modal. Hidden hermit NPC nearby. |
| 2 | **The Atelier** (building #1) | N (col 27–35, row 14–20) | Timber workshop with smoking chimney | Door → interior scene (crafts). See §D.2. |
| 3 | **Quest Board** | N-center (col 40–46, row 22–24) | Posted wooden board under a roof shelter | Click → modal listing "current vigils" (recent commits / posts / status). See §B.7.1. |
| 4 | **Waterfall Cascade** | NE (col 47–55, row 5–14) | Cliff-side waterfall with mist particle. Source of the river. | Click waterfall pool → "the water sings…" ambient dialog. Coin or shell hidden in pool. |
| 5 | **River + Stone Bridge** | E-mid (col 51–63, row 16–55) | River flows N→S along east edge. Arched stone bridge spans it at row 22–24. | Walking the bridge gives a subtle "echo" sound. Below bridge: river tiles. |
| 6 | **Embers' Forge** (building #2) | E (col 67–75, row 25–32) | Stone forge with red glow + smoke | Door → interior (skills). See §D.4. |
| 7 | **Town Square + Fountain + Mayor + Market Stalls** | Center (col 30–46, row 28–40) | Open square, central fountain (animated water 4-frame), 3 market stalls along edges, Mayor's spot | Mayor dialog (see §C). Market stalls each have a small clickable curiosity (stall A: rare seeds in jars, stall B: hand-bound bracelets, stall C: glowing crystals — all flavor text, no purchases). |
| 8 | **Vaults of Whisperleaf** (building #3) | W (col 7–18, row 31–40) | Stone library w/ arched windows | Door → interior (scrolls). See §D.3. |
| 9 | **Residential Lane** (5 weird houses) | SW (col 7–28, row 45–48) | 5 cottages in a row, each unique exterior | See §B.7.2 for each house. |
| 10 | **Hearthlight Inn + Windmill** (building #4 + neighbor) | S-center (col 22–32, row 51–56) | Inn with thatched roof, windmill blade rotating slowly | Inn door → interior (chapters). See §D.5. Windmill: click → "round and round, like the stories inside." |
| 11 | **Clock Tower + Underpass** | SE-mid (col 60–68, row 47–55) | Stone clock tower with arched passage at its base; passage tile leads visitor *under* the building | Walking through the arch: brief shadowed parallax, glowing crystal particle, clock chime sound. Connects upper valley to beach. |
| 12 | **Beach + Sand** | S (col 30–70, row 56–58) | Sand tiles, scattered shells, beach grass tufts | Click shells (5 total scattered) → collection notification ("you found a striped shell"). |
| 13 | **Fishing Dock** | S-mid (col 50–56, row 57–59) | Wooden dock extending into sea, fishing rod prop standing | Click dock end → fishing minigame (§B.7.3). |
| 14 | **Beacon of Distant Roads** (building #5) | SE (col 70–78, row 56–59) | Tall lighthouse, lantern revolving 8-frame | Door → interior (signal-flames / contact). See §D.6. |

**Forest border:** outermost rows/cols (row 0–1, row 59, col 0–1, col 78–79) are dense pine trees that block movement. Visitor cannot walk off-map.

### B.4 Tilemap technical notes

- **Format:** hand-written JSON in `public/tilemaps/aetherveil.json` (Phaser tilemap JSON schema). Plus three layers: `terrain` (grass/sand/water/path), `decor` (trees/flowers/rocks/lanterns), `collision` (boolean grid for blocked tiles).
- **Tile size:** 32×32 px.
- **Camera:** `Phaser.Cameras.Scene2D.Camera` with bounds = world bounds. `startFollow(player, true, 0.1, 0.1)` for smooth lerp. Deadzone 200×120 px (player can move within deadzone before camera scrolls).
- **Layered rendering:** ground layer first → decor (with depth-sort by y-axis so player passes behind tall trees) → buildings (also y-sorted) → player → particles → UI overlay.
- **Performance:** off-screen tiles culled by Phaser automatically. Particle systems region-gated (cherry petals only spawn when camera near grove; mist only near waterfall).

### B.5 The five portfolio buildings (preserved aliases, new locations)

Re-stated for clarity. Aliases unchanged from v1 spec. New locations within the valley:

| # | Alias | Location | Door tile (col, row) |
|---|-------|----------|---------------------|
| 1 | **The Atelier** | N town outskirt | (31, 18) |
| 2 | **Vaults of Whisperleaf** | W of town square | (12, 38) |
| 3 | **Embers' Forge** | E across bridge | (70, 29) |
| 4 | **The Hearthlight Inn** | S of town | (26, 55) |
| 5 | **Beacon of Distant Roads** | SE on beach | (73, 58) |

Naming rules (NEVER write "Fatih" / "projects" / "skills" / "articles" / "about" / "contact") still apply. See §B.3 of v1 spec — preserved.

### B.6 Atmospheric details

#### B.6.1 Cherry Blossom Grove (NW)

- Cherry tree sprite: rose-pink canopy, gnarled trunk, 32×64 px (occupies 2 vertical tiles). 6–8 trees clustered.
- **Falling petal particles:** spawn near top of grove, drift diagonal SW, fade after 4 s. Cap 30 active particles in viewport. Pause when camera leaves region (perf).
- **Swing:** rope tied to lowest branch of largest tree. Static sprite. Click → small animation (swing sways 2 s) + dialog: *"the rope creaks. it has held weight before."*
- **Meditation Stone:** flat rock with carved spiral. Click → modal with a hand-picked philosophy line:
  - *"the river does not hurry, yet it reaches the sea."*
  - *"a quiet hour is the deepest currency."*
  - *"perfect is the enemy of shipped."* (RPG-language easter egg)
  Modal auto-cycles through 5 quotes on re-clicks.

#### B.6.2 Waterfall Cascade (NE)

- Cliff face sprite tiles (3 vertical), water-fall animated sprite (6 frames, 12 fps loop).
- **Mist particle:** subtle white wisps at base, drift up + fade. 15 particles cap.
- **Sound (J.7):** loop of soft waterfall white noise, volume tied to distance from camera center.
- **Hidden coin:** at the pool base, a glint sprite blinks every 4 s. Click → "you found an old copper coin. its face is worn smooth." Adds to localStorage `aetherveil.findings`.

#### B.6.3 River + Stone Bridge

- River tiles: animated water (3 frames, 6 fps, slow drift). Tile width 2 cols (col 51 + col 52 along most rows).
- Bridge: stone-arch sprite spanning the river at rows 22–24. Walking *on* the bridge plays a soft footstep echo. Bridge railings are decor; visitor cannot fall.
- River cannot be walked into (collision tile). Bridge is the only crossing.

#### B.6.4 Market stalls (Town Square)

3 small wooden stalls on the periphery of the square. Each has a static decorative item on top + clickable interaction. Stall keeper sprites (silent NPCs, click = wave animation):

- **Stall α — Whisperleaf Seeds.** Glass jars of glowing seeds. Click → *"these seeds grow what you tend them with. the keeper smiles knowingly."*
- **Stall β — Threaded Charms.** Hand-bound bracelets in a basket. Click → *"a child traveled far to gather these. each is a knot of intent."*
- **Stall γ — Soft Crystals.** Faintly pulsing geodes. Click → *"the crystal hums at your approach. it remembers attention."*

#### B.6.5 Windmill (S, next to Inn)

- Tall stone base + 4 rotating blade sprites (32 fps rotation, slow). Always visible from southern half of map.
- Click base door (unlocked) → tiny modal: *"the miller is asleep. flour dust drifts in shafts of light."*

#### B.6.6 Clock Tower + Underpass (SE-mid)

- 3-tile-tall stone clock tower. Top face shows a clock at static "3 o'clock" with a slow second-hand animation.
- Base has an arched passage tile (2 tiles wide). Visitor walks THROUGH the tower. Inside the arch:
  - Camera slightly dims (lighting tween, -0.3 brightness over 1 s).
  - Glowing crystal sprites embedded in the wall pulse.
  - Audio: faint clock-tick + occasional chime (J.7).
- Connects upper valley (north of row 47) to beach (south of row 55) for visitors who don't want to take the bridge.

#### B.6.7 Beach + Sea

- Sand tiles row 57–58. Beach grass tufts (decor) every ~4 cols. Shell sprites (5 unique colours scattered).
- Sea tiles row 60+: 2-frame animated wave. Visitor cannot walk into sea (collision).
- **Sunset wash (J.7):** at idle 3 min, fade in a warm orange overlay over the whole map for the "sunset" mood. Optional.

---

### B.7 Side activities / curiosities

#### B.7.1 The Quest Board

- Wooden notice board under a small roof shelter, at the north edge of the town square. Visible from spawn.
- Click → modal listing **"Current Vigils"** — a small feed of what the absent craftsman is currently working on:
  - **Pinned:** "tending the fires at TurnkeyID — keeping the kettle on"
  - 3–5 dynamic items: latest commits / latest blog post / latest open-source merge
  - Each item phrased in RPG language. E.g., a real commit `feat: add retry to /api/payment` becomes "[scroll] taught the gates to wait and try again before turning a traveler away."
- **Data source:** static JSON at `game/data/vigils.json` (hand-curated). Optional: build-time script pulls latest 5 from `https://api.github.com/users/fatihaziz/events/public` and maps to RPG strings. Defer to J.3.
- Modal footer: *"the board is dusted weekly. check back."*

#### B.7.2 Residential Lane — 5 weird houses

A short row of cottages, west of the underpass, south of Vaults. Each cottage has a unique exterior sprite + a quirky NPC or interactive prop.

**House 1: The Cat Lady's Porch**
- Cottage with mossy roof, 5 cat sprites lounging in different poses on porch / steps / windowsill.
- Click any cat → cat animation (stretch / yawn / blink / roll) + dialog from cat lady inside (window open):
  - cat 1: *"that's marigold. she'll be twelve come autumn."*
  - cat 2: *"don't mind tinder — she sleeps eighteen hours."*
  - cat 3: *"oh, the gray one is new. found him by the river."*
  - cat 4: *"smudge thinks he's a tiger. don't tell him otherwise."*
  - cat 5: *"that one has no name yet. names are for cats who choose to stay."*
- Hidden achievement: pet all 5 cats → localStorage `aetherveil.findings.cats=true`.

**House 2: The Inventor's Workshop (the other workshop)**
- Smaller cottage, copper pipes sticking out of roof, smoke puffs every 4 s. Outside: a weird contraption sprite (gears + bellows + lantern). NOT the Atelier — this is a small-time tinkerer.
- Click contraption → animation (gears spin) + dialog: *"i can't figure out what it does either. but it does it well."*
- Hidden: click contraption 7 times → it produces a tiny rune that floats into the visitor's "findings".

**House 3: The Painter's Cottage**
- Three easels in front. Each easel shows a different painting (placeholder pixel-art): a sunset, a ship at sea, an unfinished portrait facing away.
- Click each painting → modal showing the artwork enlarged + a one-line caption:
  - sunset: *"painted the day the lighthouse first lit."*
  - ship: *"never reached the shore. perhaps it preferred the journey."*
  - portrait: *"i'll finish it when i remember the face."*

**House 4: The Hermit's Hut**
- Smallest cottage, dark windows, herbs hanging by the door. Old hermit sprite sits on a stump outside.
- Click hermit → dialog tree of riddles. After answering (any answer accepted), hermit shares a one-liner:
  - riddle 1: *"what walks the road without leaving a footprint?"* (answer hint: "a thought")
  - riddle 2: *"what burns brighter the more it gives?"* (answer hint: "a lantern")
  - riddle 3: *"what is heaviest when it weighs nothing?"* (answer hint: "a regret")
- After all 3 riddles: hermit gives an obscure compliment: *"few travelers stop to listen. fewer still hear themselves listening."*

**House 5: The Music Hut**
- Cottage with painted notes on the door. As visitor approaches (within 5 tiles), a faint chiptune loop fades in.
- Click door → modal opens a tiny "music box" UI with 4 chiptune track tiles (e.g., "Walking Theme", "Forge Hammer", "Sea Breeze", "Hearth Glow"). Click each → plays a 6 s sample.
- All clips: tiny 8-bit loops, royalty-free CC0 (e.g., Joel Steudler / Kenney audio).

#### B.7.3 Fishing Minigame (at the Dock)

- Stand on dock end tile + press SPACE / click → enter fishing mini-state.
- UI overlay: a vertical bar with a small "hook zone". A fish-fin shadow moves left/right under the surface (sprite).
- 3–6 seconds later, a "!" appears + line tightens. Player has 1.5 s window to click / press SPACE again.
- On success: catch sprite appears (1 of 6 fish, weighted random):
  - Common (60%): minnow, sea-bream
  - Uncommon (30%): silver eel, ribbon-fish
  - Rare (8%): moon-mackerel
  - Mythic (2%): "the keeper of the dock" — triggers special dialog and adds to findings collection
- Catch saved to `localStorage.aetherveil.fishing`. Beach NPC (J.4) reacts if mythic caught.
- On fail: line goes slack, dialog: *"the fish thought better of it. try again."*
- Minigame uses Phaser timers + input listeners — no heavy library needed.

#### B.7.4 Other interactives (scattered)

- **Signpost at south spawn:** *"AETHERVEIL · pop. quiet, mostly"* — flavor.
- **Fountain in town square:** click → *"a copper coin sits at the bottom. you decide not to disturb it."*
- **Lantern posts (5 around map):** at evening (J.7 sunset), each lights up. Click any → *"the lantern keeper knows when to come."*
- **Bird flock:** sprite of 5 silhouette birds flies across screen every ~90 s. Decorative only.

---

## §C The Mayor — Halden of Aetherveil (updated welcome)

### C.1 Character (unchanged)

Mayor Halden. Late-fifties, weathered cloak the colour of moss, walks with a slight stoop and a silver-tipped cane. Carries a small ledger. Speaks formally but warm. Never names the absent craftsman; only points to the work.

Sprite needs: 4-dir walk × 4 frames (16) + idle cane-lean × 2.

### C.2 Welcome dialog (revised for valley scope)

**Beat 1 — first arrival (at Town Square fountain):**
> Ah, a new face! Welcome, traveler. You've reached **Aetherveil** — a small valley of craftsmen, dreamers, and one talkative miller. I am the Mayor here. Halden, if you'd like a name to call me by.

**Beat 2 — north arc:**
> To your north stands **The Atelier** — where wonders are forged from focused thought. Past it, follow the petal-fall and you'll find the **Cherry Blossom Grove**; there's a swing, a stone for sitting, and a hermit who tells riddles if you let him. The river's source is up that way too — a **Waterfall** that hasn't gone quiet in any season I remember.

**Beat 3 — east arc:**
> Cross the **Stone Bridge** east of here and you'll find the **Embers' Forge** — every art has its temper learned there. Mind the river; it runs swift after the cascade.

**Beat 4 — west + south arc:**
> West holds the **Vaults of Whisperleaf** — bound scrolls collected over many seasons. Take down any that catches your eye; the keeper minds the silence, not the visitors.
> 
> South of here is the **Hearthlight Inn**; sit by the fire and let Marlowe tell you of the chapters. The **Windmill** beside it turns whether anyone's watching or not.
> 
> Further south — down the lane of odd little houses, past the Cat Lady and the Inventor and the Painter and the Hermit and the Music Hut — you'll find a **Clock Tower** you can walk *through*. The arch leads down to our **Beach**. Cast a line at the **Dock** if you fancy. The **Beacon Lighthouse** stands beyond — light a flame there and a message will travel.

**Beat 5 — close:**
> Wander where you will, traveler. Each door listens. Each shopkeep speaks. Even the cats answer, after a fashion. When you've seen the valley, return to the fountain. I'll be here.

**Beat 5 (returning visitor):**
> Welcome back. The valley's much as you left it — though the fishing's been better.

**Beat 5 (fully explored, all regions + interiors visited):**
> You've walked the whole of Aetherveil now, traveler. You're welcome to linger, or carry word of us with you down the road. Either honors the valley.

### C.3 Dialog box style — unchanged from v1 (Stardew-ish bottom-aligned wood frame, 30 char/sec typewriter, portrait, name plate, advance on click/SPACE).

---

## §D Building Interiors

Five buildings — **The Atelier**, **Vaults of Whisperleaf**, **Embers' Forge**, **The Hearthlight Inn**, **Beacon of Distant Roads** — keep their v1 specs unchanged. See v1 §D.1–§D.6 (preserved below for reference).

### D.1 Common interior structure (unchanged)

- 96 px top band: wooden sign with alias + sub-line.
- ~400 px main: themed tilemap.
- Shopkeep NPC (silent / 2-3 beat dialog on click).
- Clickable display items → Vue modal with content card.
- Bottom door tile labeled `<- Back to Aetherveil`. Step or click to return to overworld (fade transition).
- Bottom HUD persistent dialog area.

### D.2 The Atelier — 5–6 workbenches with project crafts. (full spec unchanged from v1)

### D.3 Vaults of Whisperleaf — bookshelves with 8–12 scrolls (Medium-fed). (full spec unchanged from v1)

### D.4 Embers' Forge — weapon rack with mastery pips per skill. (full spec unchanged from v1)

### D.5 The Hearthlight Inn — 5 mantel trophies = 5 chapters. (full spec unchanged from v1)

### D.6 Beacon of Distant Roads — 4 signal-flames = 4 contact channels. (full spec unchanged from v1)

---

## §E Sprite Atlas Outline (expanded for valley scope)

### E.1 Atlases

| Atlas | Purpose | Source plan |
|-------|---------|-------------|
| `characters.png` | Visitor + Mayor Halden + 5 shopkeeps + Cat Lady + Inventor + Painter + Hermit + Musician + Miller + Beach NPC + Stall keepers (~14 distinct NPCs). 4-dir × 4-frame walk OR 2-frame idle for stationary. | **Kenney Tiny Town** + **Kenney Roguelike RPG** — re-tint heads/clothes for variety via Phaser tint. |
| `tiles_overworld.png` | Grass (4 variants), dirt path, cobblestone, sand, sea (2-frame anim), river (3-frame anim), waterfall (6-frame anim), cliff face (4 tiles), wooden bridge planks + railings, fence, lantern post, signpost, flower clusters, mushroom clusters, beach grass, shell, fountain (4-frame), pine tree, oak tree, **cherry tree (pink canopy)**, bush, rock (small/medium/large), windmill base, windmill blade (animated), clock tower face, clock hands. | **Kenney Tiny Town** primary + custom tints for cherry tree. |
| `tiles_interior_wood.png` | Atelier + Inn interiors. Same as v1. | Kenney Tiny Town. |
| `tiles_interior_stone.png` | Vaults + Forge + Beacon interiors. Same as v1. | Kenney Tiny Dungeon. |
| `tiles_interior_special.png` | Clock Tower interior (underpass arch shadow + crystal sprites). Cat Lady porch furniture. Painter's easel + canvas variants. Inventor's contraption sprite. Music hut painted door. Quest board sprite + papers. | Hand-pick from Kenney + simple recolours. |
| `ui.png` | Dialog box + brass corners + name plate + chevron + modal frame + buttons + anvil mastery pips + fishing UI (rod, bar, hook, fish silhouettes) + cat collection badges + shell collection badges. | Kenney UI Pack RPG. |
| `particles.png` | Cherry petals (3 frames), waterfall mist (2 frames), forge ember (3 frames), firefly (2 frames), sparkle (4 frames), chimney smoke (4 frames). | Kenney Particle Pack + hand-tints. |
| `audio/*.ogg` (J.7) | Step, door, page-turn, flame whoosh, clock-chime, fishing-bite, waterfall-loop, ambient-birds, ambient-cricket, windmill-creak, 4 chiptune music-hut clips. | freesound.org CC0 + Kenney audio. |

**Atlas total budget:** target < 1.5 MB combined. Pixel art compresses tiny.

### E.2 Tilemap layers (Phaser)

```
Layer 0: terrain     (grass/path/sand/water — single tile per cell)
Layer 1: terrain_overlay (path corners, shoreline edges, transitions)
Layer 2: decor_low   (flowers, mushrooms, shells, small rocks)
Layer 3: decor_high  (trees, lantern posts, fountain, signposts — y-sorted with player)
Layer 4: buildings   (walls, roofs — y-sorted with player)
Layer 5: particles   (cherry petals, mist, embers — Phaser ParticleEmitter regions)
Layer 6: player      (visitor sprite)
Layer 7: npcs        (Mayor + shopkeeps + weird-house NPCs — y-sorted)
Layer 8: foreground_overlay (clock tower upper face, bridge arch shadow)
Collision grid: flat boolean array, blocks player.body
```

### E.3 Animation specs (additions for valley)

| Sprite | Frames | FPS | Loop |
|--------|--------|-----|------|
| Waterfall | 6 | 12 | yes |
| River tile | 3 | 6 | yes (slow drift) |
| Cherry petal particle | 3 | 6 | one-shot, spawn rate ~5/s |
| Mist particle | 2 | 4 | one-shot, spawn rate ~3/s |
| Windmill blade | 8 | 4 | yes (continuous rotation) |
| Clock second-hand | 60 | 1 | yes (per-second tick) |
| Fountain water | 4 | 6 | yes |
| Fish-bite "!" | 2 | 6 | one-shot (alert) |
| Cat stretch/blink/roll | 3 | 4 | one-shot on click |
| Bird flock | 4 | 6 | one-shot (90 s interval) |

---

## §F Tech Stack & Integration (unchanged from v1)

Phaser 3, single-page Nuxt SPA, `<ClientOnly>` canvas wrapper, EventBus for Phaser↔Vue communication, Vue handles content card modals + the fishing minigame UI overlay, Phaser handles overworld + dialog box + scene transitions.

Repo layout (revised for valley):

```
.
├── pages/index.vue                       # mounts <GameCanvas /> + modals + fishing UI
├── components/game/
│   ├── GameCanvas.vue                    # client-only Phaser wrapper
│   ├── ContentModal.vue                  # Vue modal for shop content cards
│   ├── QuestBoardModal.vue               # Vue modal for "current vigils" feed
│   ├── FishingOverlay.vue                # Vue overlay for fishing minigame UI
│   ├── MusicBoxModal.vue                 # Vue modal for music-hut tracks
│   ├── PaintingModal.vue                 # Vue modal for painter's canvases
│   └── HudFooter.vue                     # findings counter, footer hints
├── game/
│   ├── config.ts
│   ├── scenes/
│   │   ├── Boot.ts                       # preload all atlases + tilemap + audio
│   │   ├── AetherveilOverworld.ts        # the valley — single huge scene
│   │   ├── Atelier.ts
│   │   ├── VaultsOfWhisperleaf.ts
│   │   ├── EmbersForge.ts
│   │   ├── HearthlightInn.ts
│   │   └── BeaconOfDistantRoads.ts
│   ├── regions/                          # logical helpers, not scenes
│   │   ├── cherryGrove.ts                # spawns petals, hermit, swing, stone
│   │   ├── waterfall.ts                  # spawns mist, hides coin
│   │   ├── residentialLane.ts            # spawns 5 weird-house NPCs + interactions
│   │   ├── beach.ts                      # shells, dock fishing trigger
│   │   ├── clockTower.ts                 # underpass shadow tween
│   │   └── marketStalls.ts               # 3 stalls + keepers
│   ├── npcs/
│   │   ├── MayorHalden.ts
│   │   ├── Hermit.ts                     # riddles
│   │   ├── CatLady.ts                    # window-only voice + 5 cats
│   │   ├── Inventor.ts
│   │   ├── Painter.ts
│   │   ├── Musician.ts
│   │   ├── Miller.ts                     # sleeps; door dialog
│   │   ├── BeachNPC.ts                   # reacts to mythic fish catch
│   │   └── interior shopkeeps (Apprentice / Keeper / Smith / Marlowe / Wynna)
│   ├── minigames/
│   │   └── fishing.ts                    # Phaser state machine + RNG roll
│   ├── data/
│   │   ├── crafts.json                   # Atelier
│   │   ├── scrolls.json                  # Vaults (Medium-fed at build)
│   │   ├── armory.json                   # Embers
│   │   ├── chapters.json                 # Inn
│   │   ├── flames.json                   # Beacon URLs
│   │   ├── vigils.json                   # Quest Board (commits/posts/status)
│   │   ├── meditation.json               # 5 stone quotes
│   │   ├── riddles.json                  # Hermit's 3
│   │   ├── catFacts.json                 # Cat Lady's 5 lines
│   │   ├── paintings.json                # 3 painting captions
│   │   ├── music.json                    # 4 music-hut tracks
│   │   └── fish.json                     # 6 fish species + weights + captions
│   ├── ui/
│   │   ├── DialogBox.ts
│   │   └── EventBus.ts
│   └── util/save.ts                      # localStorage findings/cats/fish/visited
├── public/atlases/
├── public/tilemaps/aetherveil.json
├── public/audio/                         # J.7
└── docs/spec/town-square-rpg.md          # this file
```

---

## §G Asset Acquisition (expanded packs)

### G.1 Kenney CC0 packs (next /grind J.0)

| Pack | URL | Used for |
|------|-----|---------|
| Tiny Town | https://kenney.nl/assets/tiny-town | Town tiles, building exteriors, residential houses, characters, animals |
| Tiny Dungeon | https://kenney.nl/assets/tiny-dungeon | Interior stone tiles, weapons, props, cat sprites |
| Roguelike RPG Pack | https://kenney.nl/assets/roguelike-rpg-pack | Weapon variants, character variants, dialog faces |
| UI Pack RPG | https://kenney.nl/assets/ui-pack-rpg-expansion | Dialog box frames, buttons, modal borders, fishing bar |
| Particle Pack | https://kenney.nl/assets/particle-pack | Petals, embers, sparkles, mist, smoke |
| Pixel UI Pack (fishing UI) | https://kenney.nl/assets/pixel-ui-pack | Fishing rod icon, fish silhouette, "!" alert sprite |
| Cursor Pack (optional) | https://kenney.nl/assets/cursor-pack | Magnifying-glass cursor for hover-over hotspots |

**Cherry tree:** Tiny Town's default tree retinted pink via Phaser `tint` OR a tiny hand-edit (~10 min in any pixel editor). Defer hand-edit to J.3 visual-polish pass.

### G.2 Storage convention

```
public/atlases/
├── characters.png + .json
├── tiles_overworld.png + .json
├── tiles_interior_wood.png + .json
├── tiles_interior_stone.png + .json
├── tiles_interior_special.png + .json
├── ui.png + .json
└── particles.png + .json
public/tilemaps/
└── aetherveil.json                       # 80x60 tile grid, 3+ layers
public/audio/                             # J.7
```

### G.3 Fonts

- **Press Start 2P** (Google Font, OFL) — primary pixel font.
- **Mondapick** (project font) — modal body fallback.

---

## §H Acceptance

### H.1 This run (design v2)

- [x] §B replaced with Aetherveil Valley (80×60, 14 regions documented)
- [x] §B.6 atmospheric details written
- [x] §B.7 side activities written (quest board, weird houses, fishing, fountain, lanterns, birds)
- [x] §C Mayor welcome dialog expanded to cover all regions
- [x] §E atlas list expanded for valley scope
- [x] §G Kenney packs list expanded
- [x] §I phase plan re-staged for valley scope
- [x] §J dialog scripts added for weird-house NPCs + meditation stone + riddles + cat facts + paintings + fish
- [x] CLAUDE.md + docs/README.md still accurate (point at this spec)
- [x] `pnpm build-github` exits 0 (docs-only change)

### H.2 J.0 foundation (next /grind)

- `pnpm add phaser` succeeds
- `game/config.ts` + `game/scenes/Boot.ts` boot Phaser inside `pages/index.vue`
- All 7 atlases downloaded + placed under `public/atlases/`
- Hand-built `public/tilemaps/aetherveil.json` (initially with just terrain + collision; details added in J.1)
- Boot scene shows "Loading Aetherveil…" → fades to overworld
- `pnpm build-github` exits 0; manual `/` renders Phaser canvas, no console errors

### H.3 J.1 overworld + Mayor (after J.0)

- Player sprite walks 4-direction with arrow / WASD
- Camera follows player smoothly with deadzone
- All 14 regions visible (tiles + buildings placed, decorative props placed)
- Mayor walks to player on spawn, types beats 1–5, returns to fountain
- 5 building doors clickable (open modal stub "Coming soon")
- localStorage tracks first-visit

### H.4 J.2 residential lane + weird houses

- 5 weird-house NPCs spawned with dialog
- Cat Lady: 5 cats clickable with reactions + cat lady window-voice
- Inventor: contraption click w/ gear animation + 7-click rune easter-egg
- Painter: 3 easels clickable → modals with paintings + captions
- Hermit: 3-riddle dialog tree
- Music Hut: door modal w/ 4 chiptune clips (audio assets required → may bleed into J.7)

### H.5 J.3 quest board + atmosphere

- Quest Board modal renders "Current Vigils" from `vigils.json`
- Cherry Blossom Grove: petal particles, swing, meditation stone with 5 quotes
- Waterfall: 6-frame water + mist particles + hidden coin
- Market stalls: 3 clickable with flavour dialog
- Windmill blade rotation

### H.6 J.4 beach + fishing + underpass + beacon area

- Beach sand tiles + 5 shells (collectible w/ localStorage)
- Clock Tower underpass tween (camera dim + crystal glow)
- Fishing minigame: bite → click window → catch with weighted RNG
- Beach NPC reacts to mythic fish catch
- Beacon door clickable (modal stub if interior not yet built)

### H.7 J.5–J.9 Five building interiors (PARALLEL after J.1)

Each is its own /grind: Atelier / Vaults / Embers / Inn / Beacon — per v1 spec interior designs.

### H.8 J.10 polish + ship

- Audio: step, door, page-turn, flame, clock chime, waterfall loop, ambient cricket/birds, windmill creak
- Particle ambient: cherry petals + fireflies (post-sunset) + embers at forge
- Sunset overlay (3-min idle trigger)
- Mobile: viewport scaling + on-screen virtual D-pad (only for touch devices)
- Reduced-motion: instant transitions, no parallax, no particles
- Accessibility: keyboard-only fully playable, focus rings, aria-live for dialog
- Final deploy: `pnpm gh-publish`

---

## §I Implementation Phase Plan (revised for valley scope)

```
J.0   Foundation
      - Install phaser, scaffold game/ folder, Boot scene, atlas loader
      - Download all 7 Kenney packs to public/atlases/
      - Hand-write skeleton aetherveil.json (terrain layer only, blocking outer-rim)
      - Verify: pnpm build-github exits 0; / renders Phaser canvas

J.1   Overworld + Mayor (sequential after J.0)
      - AetherveilOverworld scene with full 80x60 tilemap (terrain + decor)
      - Player sprite + 4-dir movement + smooth camera follow
      - All 5 building doors placed (modal stubs)
      - Mayor NPC walks to player, dialog box, 5-beat welcome
      - localStorage first-visit flag

J.2   Residential lane + 5 weird houses (sequential)
      - 5 cottage exteriors placed
      - Cat Lady + 5 cats interactive
      - Inventor + contraption (gear anim + 7-click easter egg)
      - Painter + 3 easels (modals)
      - Hermit + 3 riddles
      - Music Hut + modal (audio defers to J.10 if pack not ready)

J.3   Quest board + atmosphere
      - Quest Board modal + vigils.json
      - Cherry Blossom Grove (petals, swing, meditation stone)
      - Waterfall (anim + mist + hidden coin)
      - Market stalls (3, flavour)
      - Windmill blade rotation
      - Fountain animation polish

J.4   Beach + fishing + underpass + beacon-area
      - Beach sand tiles + 5 shells (collection)
      - Clock Tower underpass camera-dim tween
      - Fishing minigame end-to-end
      - Beach NPC w/ mythic-catch reaction
      - Beacon door (modal stub if not built)

J.5-J.9   Five building interiors (PARALLEL after J.1)
      - One /grind run per building, each ships its scene + content data + Vue ContentModal slot

J.10  Polish + ship
      - Audio
      - Particles (cherry + firefly + ember)
      - Sunset overlay
      - Mobile + a11y
      - pnpm gh-publish
```

10 phases total. J.5–J.9 parallel-runnable (independent scenes). J.0 → J.4 sequential (each builds on prior overworld state).

---

## §J Dialog Master Reference (expanded)

### J.1 Mayor Halden — town square (see §C.2 above for full beats)

```json
{
  "mayor.firstArrival": [...],
  "mayor.tourNorth": [...],
  "mayor.tourEast": [...],
  "mayor.tourWestSouth": [...],
  "mayor.close": [...],
  "mayor.returning": [...],
  "mayor.fullyExplored": [...]
}
```

(Full text in spec §C.2 — implementation reads from `game/data/dialog.json`.)

### J.2 Shopkeep greetings (interior NPCs — unchanged from v1)

```json
{
  "apprentice.atelier":    "The master is in the back. Inspect the workbenches, if you'd like.",
  "keeper.vaults":          "Mind the silence, traveler. The scrolls speak louder than my voice.",
  "smith.embers":           "Every weapon is a habit. Lift one and feel its weight.",
  "marlowe.inn":            "Pull a stool, traveler. I'll keep your cup full while the trophies tell their tales.",
  "wynna.beacon":           "Each flame burns for a different road. Choose the one whose voice you wish to carry."
}
```

### J.3 Weird-house NPCs

```json
{
  "catLady.greeting":       "Mind the cats, traveler. They've claimed every sunny tile.",
  "catLady.cat.marigold":   "That's marigold. She'll be twelve come autumn.",
  "catLady.cat.tinder":     "Don't mind tinder -- she sleeps eighteen hours.",
  "catLady.cat.gray":       "Oh, the gray one is new. found him by the river.",
  "catLady.cat.smudge":     "Smudge thinks he's a tiger. Don't tell him otherwise.",
  "catLady.cat.unnamed":    "That one has no name yet. Names are for cats who choose to stay.",
  "catLady.allFiveFound":   "You've met them all. Marigold approves -- in her way.",

  "inventor.contraption":   "I can't figure out what it does either. but it does it well.",
  "inventor.sevenClicks":   "Ah! It made a thing! ...I think that's good.",

  "painter.greeting":       "Take a look. Some of them are finished. Some of them never will be.",
  "painter.sunset":         "Painted the day the lighthouse first lit.",
  "painter.ship":           "Never reached the shore. perhaps it preferred the journey.",
  "painter.portrait":       "I'll finish it when i remember the face.",

  "hermit.greeting":        "Pull up a stump, traveler. The road's been long, hasn't it.",
  "hermit.riddle1":         "What walks the road without leaving a footprint?",
  "hermit.riddle1.reveal":  "A thought. you carry many of them, i'd guess.",
  "hermit.riddle2":         "What burns brighter the more it gives?",
  "hermit.riddle2.reveal":  "A lantern. or a person, in their better hours.",
  "hermit.riddle3":         "What is heaviest when it weighs nothing?",
  "hermit.riddle3.reveal":  "A regret. set it down before you walk on.",
  "hermit.allThree":        "Few travelers stop to listen. Fewer still hear themselves listening.",

  "musician.greeting":      "Listen. Pick a song. Each one was written for a different walk."
}
```

### J.4 Meditation stone quotes (Cherry Blossom Grove)

```json
[
  "the river does not hurry, yet it reaches the sea.",
  "a quiet hour is the deepest currency.",
  "perfect is the enemy of shipped.",
  "what you tend grows. what you ignore returns wild.",
  "you are allowed to begin again, today, before noon."
]
```

### J.5 Market stall flavour

```json
{
  "stall.seeds":            "These seeds grow what you tend them with. the keeper smiles knowingly.",
  "stall.charms":           "A child traveled far to gather these. each is a knot of intent.",
  "stall.crystals":         "The crystal hums at your approach. it remembers attention."
}
```

### J.6 Fish captions (caught species)

```json
{
  "fish.minnow":            "A tiny minnow. Not much, but the line did its work.",
  "fish.seaBream":          "A respectable sea-bream. Marlowe will know what to do with it.",
  "fish.silverEel":         "A silver eel. They say one of these once led a fleet home.",
  "fish.ribbonFish":        "A ribbon-fish. They unfurl when held to the light.",
  "fish.moonMackerel":      "A moon-mackerel. Rare. Worth a second cast another day.",
  "fish.keeperOfTheDock":   "Something old and grey looks up at you. it nods, and slips back beneath. you have its blessing."
}
```

### J.7 Misc interactives

```json
{
  "swing.creak":            "The rope creaks. it has held weight before.",
  "fountain.coin":          "A copper coin sits at the bottom. you decide not to disturb it.",
  "miller.asleep":          "The miller is asleep. flour dust drifts in shafts of light.",
  "lantern.keeper":         "The lantern keeper knows when to come.",
  "signpost.town":          "AETHERVEIL -- pop. quiet, mostly.",
  "shell.found":            "You picked up a striped shell. The sea has many of these.",
  "coin.found":             "An old copper coin. its face is worn smooth.",
  "rune.found":             "A tiny rune of unknown make. it hums when you hold it."
}
```

---

## §K Open Questions

Defaults locked unless answered before each phase.

| ID | Question | Blocks | Default |
|----|---------|--------|--------|
| K.1 | Pixel scale: 32×32 (Stardew-ish) confirmed? | J.0 | 32×32 |
| K.2 | Camera follow: smooth lerp w/ deadzone OR snap-to-region edges? | J.1 | Smooth lerp w/ 200×120 px deadzone |
| K.3 | Movement: grid-snapped (Pokemon) or smooth-axis-aligned (Stardew)? | J.1 | Smooth axis-aligned (Stardew) |
| K.4 | Quest board data: hand-curated `vigils.json` or GitHub-events fetch at build? | J.3 | Hand-curated for launch; GitHub-events fetcher post-launch |
| K.5 | Music-hut clips: launch with audio in J.2 or defer to J.10 audio pass? | J.2 | Defer to J.10; ship door modal w/ text-only at J.2 |
| K.6 | Day/night cycle: full cycle, sunset-only-on-idle, or none? | J.10 | Sunset overlay on 3-min idle only (lightweight) |
| K.7 | Save state: localStorage only or also URL-fragment shareable state? | J.1 | localStorage only |
| K.8 | Visitor sprite look: neutral hooded traveler or character creator? | J.1 | Neutral hooded traveler |
| K.9 | Dialog language: English only at launch, or also Indonesian/JP? | J.1 | English only at launch. Other locales post. |
| K.10 | Mobile experience: virtual D-pad + same gameplay, OR mobile-optimized fewer regions? | J.10 | Virtual D-pad, same content. |

---

## §L Change Log

| Date | Change |
|------|-------|
| 2026-05-11 | v1: town-square spec created (single-screen, 24×16). 3D direction scrapped. |
| 2026-05-11 | v2 (this revision): map expanded to full Aetherveil Valley (80×60, 14 named regions). Added: cherry blossom grove, waterfall, river+bridge, residential lane with 5 weird houses (cat lady, inventor, painter, hermit, music hut), quest board, market stalls, windmill, clock tower underpass, beach, fishing minigame, beacon lighthouse. Mayor's tour dialog expanded. Atlas + phase plan re-staged for valley scope (now 10 phases). |
