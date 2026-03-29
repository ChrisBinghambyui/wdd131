# Durgeth Preset

This local preset makes Fantasy Map Generator start with your Durgeth worldbuilding data.

## What is integrated

- A built-in `Durgeth (Custom)` cultures set
- Culture templates matching your custom Aethermoor culture roster
- Built-in namebases generated from all files in `generated maps/languages`
- Regeneration behavior that keeps `durgeth` active by default unless you switch sets

## Files changed

- `src/index.html`
- `src/modules/cultures-generator.ts`
- `src/modules/names-generator.ts`
- `src/modules/durgeth-namebases.ts`
- `public/modules/ui/options.js`

## Run

From `Fantasy-Map-Generator-master`:

```bash
npm install
npm run dev
```

Then open the app and generate a map. It should default to `Durgeth (Custom)`.

## Lore workflow

Lore is still best handled as prompt / content support while mapping. Use this companion generator to produce lore-tied people, city, and faction seeds:

```bash
c:/Users/chris/Downloads/wdd131/.venv/Scripts/python.exe "map gen proj/generated maps/generators/lore_culture_generator.py" --culture Solarirum --count 5
```

Use those outputs for:

- state names
- burg names
- faction notes
- map markers and campaign hooks
