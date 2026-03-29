from __future__ import annotations

import argparse
import json
import random
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


STOPWORDS = {
    "about",
    "after",
    "again",
    "against",
    "almost",
    "also",
    "always",
    "among",
    "another",
    "around",
    "because",
    "before",
    "being",
    "between",
    "built",
    "cannot",
    "consider",
    "culture",
    "described",
    "despite",
    "different",
    "does",
    "each",
    "either",
    "enough",
    "every",
    "find",
    "first",
    "from",
    "generations",
    "given",
    "have",
    "into",
    "just",
    "known",
    "long",
    "many",
    "most",
    "much",
    "name",
    "note",
    "often",
    "other",
    "outside",
    "people",
    "their",
    "them",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "under",
    "using",
    "very",
    "when",
    "where",
    "which",
    "while",
    "with",
    "without",
    "world",
    "worth",
}

PERSON_TITLES = [
    "Lore-Warden",
    "Oathbearer",
    "Pathfinder",
    "Archive-Keeper",
    "Banner Marshal",
    "Ember-Seer",
    "High Broker",
    "Stone Voice",
    "Border Envoy",
]

CITY_SUFFIXES = [
    "Hold",
    "Gate",
    "Reach",
    "Watch",
    "Spire",
    "Haven",
    "Cross",
    "Crown",
    "Cairn",
    "Stead",
]

FACTION_FORMS = [
    "Order of {name}",
    "House of {name}",
    "League of {name}",
    "Concord of {name}",
    "Circle of {name}",
    "Wardens of {name}",
]


@dataclass
class LoreEntry:
    lineage: str
    culture: str
    alias: str
    lore_body: str
    gm_note: str


@dataclass
class LanguagePack:
    filename: str
    key: str
    tokens: List[str]


def normalize_ascii(text: str) -> str:
    """Normalize unicode to lowercase ASCII letters only."""
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    return ascii_text.lower()


def clean_display(text: str) -> str:
    text = normalize_ascii(text)
    text = re.sub(r"[^a-z]", "", text)
    return text


def split_words(text: str) -> List[str]:
    return re.findall(r"[A-Za-z]{3,}", normalize_ascii(text))


def parse_lore_file(lore_file: Path) -> Dict[str, LoreEntry]:
    lines = lore_file.read_text(encoding="utf-8", errors="ignore").splitlines()

    entries: Dict[str, LoreEntry] = {}
    i = 0
    while i < len(lines) - 1:
        current = lines[i].strip()
        nxt = lines[i + 1].strip() if i + 1 < len(lines) else ""

        is_lineage = bool(re.fullmatch(r"[A-Z][A-Z\s\-']+", current))
        name_match = re.match(r"^([A-Za-z\-]+)\s*\(([^)]*)\)", nxt)

        if is_lineage and name_match:
            lineage = current.title()
            culture = name_match.group(1).strip()
            alias = name_match.group(2).strip()

            j = i + 2
            block: List[str] = []
            while j < len(lines):
                probe = lines[j].strip()
                maybe_next = lines[j + 1].strip() if j + 1 < len(lines) else ""
                next_is_entry = bool(
                    re.fullmatch(r"[A-Z][A-Z\s\-']+", probe)
                    and re.match(r"^([A-Za-z\-]+)\s*\(([^)]*)\)", maybe_next)
                )
                if next_is_entry:
                    break
                block.append(lines[j])
                j += 1

            block_text = "\n".join(block)
            gm_idx = block_text.find("GM Note:")
            lore_body = block_text if gm_idx == -1 else block_text[:gm_idx]
            gm_note = "" if gm_idx == -1 else block_text[gm_idx + len("GM Note:") :]

            entries[culture.lower()] = LoreEntry(
                lineage=lineage,
                culture=culture,
                alias=alias,
                lore_body=lore_body.strip(),
                gm_note=gm_note.strip(),
            )
            i = j
            continue

        i += 1

    return entries


def parse_language_file(path: Path) -> LanguagePack:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    tokens: List[str] = []

    for line in raw.splitlines():
        if "|" not in line:
            continue
        parts = [part.strip() for part in line.split("|")]
        if len(parts) < 3:
            continue
        fantasy_term = parts[2]
        for word in split_words(fantasy_term):
            cleaned = clean_display(word)
            if len(cleaned) >= 3:
                tokens.append(cleaned)

    base_key = path.stem.split("_500words")[0]
    return LanguagePack(filename=path.name, key=normalize_ascii(base_key), tokens=tokens)


def load_languages(languages_dir: Path) -> List[LanguagePack]:
    packs: List[LanguagePack] = []
    for path in sorted(languages_dir.glob("*.txt")):
        pack = parse_language_file(path)
        if pack.tokens:
            packs.append(pack)
    return packs


def pick_language_pack(culture: str, packs: List[LanguagePack], rng: random.Random) -> LanguagePack:
    culture_key = normalize_ascii(culture)

    scored: List[Tuple[int, LanguagePack]] = []
    for pack in packs:
        score = 0
        if culture_key in pack.key:
            score += 10
        for token in re.findall(r"[a-z]{4,}", culture_key):
            if token in pack.key:
                score += 3
        scored.append((score, pack))

    scored.sort(key=lambda item: item[0], reverse=True)
    top_score = scored[0][0]
    if top_score > 0:
        top_packs = [pack for score, pack in scored if score == top_score]
        return rng.choice(top_packs)
    return rng.choice(packs)


def extract_themes(lore_text: str, gm_note: str) -> List[str]:
    words = split_words(f"{lore_text} {gm_note}")
    useful = [w for w in words if len(w) >= 5 and w not in STOPWORDS]
    counts = Counter(useful)
    return [word for word, _ in counts.most_common(12)]


def blend_words(a: str, b: str) -> str:
    cut_a = max(2, len(a) // 2)
    cut_b = max(1, len(b) // 2)
    return a[:cut_a] + b[cut_b:]


def make_root(tokens: List[str], rng: random.Random) -> str:
    first = rng.choice(tokens)
    second = rng.choice(tokens)
    while second == first and len(tokens) > 1:
        second = rng.choice(tokens)

    root = blend_words(first, second)
    root = re.sub(r"(.)\1\1+", r"\1\1", root)
    root = root[:10]

    if len(root) < 4:
        root = (first + second)[:6]

    return root.capitalize()


def make_person_name(tokens: List[str], rng: random.Random) -> str:
    first = make_root(tokens, rng)
    last = make_root(tokens, rng)
    return f"{first} {last}"


def make_city_name(tokens: List[str], rng: random.Random) -> str:
    base = make_root(tokens, rng)
    if rng.random() < 0.35:
        base = f"{base}-{make_root(tokens, rng)}"
    return f"{base}{rng.choice(CITY_SUFFIXES)}"


def make_faction_name(tokens: List[str], themes: List[str], rng: random.Random) -> str:
    root = make_root(tokens, rng)
    if themes and rng.random() < 0.5:
        themed = themes[rng.randrange(len(themes))].capitalize()
        root = blend_words(clean_display(themed), clean_display(root)).capitalize()
    form = rng.choice(FACTION_FORMS)
    return form.format(name=root)


def build_hook(themes: List[str], rng: random.Random, fallback: str) -> str:
    if not themes:
        return fallback
    picks = rng.sample(themes, k=min(2, len(themes)))
    return f"Tied to {', '.join(picks)}."


def generate_seed(entry: LoreEntry, pack: LanguagePack, rng: random.Random) -> Dict[str, str]:
    themes = extract_themes(entry.lore_body, entry.gm_note)
    person_name = make_person_name(pack.tokens, rng)
    city_name = make_city_name(pack.tokens, rng)
    faction_name = make_faction_name(pack.tokens, themes, rng)

    return {
        "culture": entry.culture,
        "lineage": entry.lineage,
        "alias": entry.alias,
        "language_source": pack.filename,
        "person_name": person_name,
        "person_title": rng.choice(PERSON_TITLES),
        "person_hook": build_hook(themes, rng, "A rising figure with contested authority."),
        "city_name": city_name,
        "city_hook": build_hook(themes, rng, "A strategic settlement shaped by old pressures."),
        "faction_name": faction_name,
        "faction_hook": build_hook(themes, rng, "A faction balancing power, survival, and identity."),
    }


def render_text(seeds: List[Dict[str, str]]) -> str:
    blocks: List[str] = []
    for idx, seed in enumerate(seeds, start=1):
        blocks.append(
            "\n".join(
                [
                    f"=== Seed {idx} ===",
                    f"Culture: {seed['culture']} ({seed['lineage']}, {seed['alias']})",
                    f"Language file: {seed['language_source']}",
                    f"Important person: {seed['person_name']} ({seed['person_title']})",
                    f"  Hook: {seed['person_hook']}",
                    f"City: {seed['city_name']}",
                    f"  Hook: {seed['city_hook']}",
                    f"Faction: {seed['faction_name']}",
                    f"  Hook: {seed['faction_hook']}",
                ]
            )
        )
    return "\n\n".join(blocks)


def resolve_default_paths(script_path: Path) -> Tuple[Path, Path]:
    root = script_path.parent.parent
    lore_primary = script_path.parent / "Lore for integration" / "Durgeth_Lore_Compendium_v5.docx.txt"
    lore_fallback = script_path.parent / "lore" / "Durgeth_Lore_Compendium_v5.docx.txt"
    languages_dir = root / "languages"
    lore_file = lore_primary if lore_primary.exists() else lore_fallback
    return lore_file, languages_dir


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate culture-aware names and hooks from Durgeth lore + language files."
    )
    parser.add_argument("--culture", help="Culture name, e.g. 'Solarirum'. Omit for random culture.")
    parser.add_argument("--count", type=int, default=3, help="How many seeds to generate.")
    parser.add_argument("--seed", type=int, default=None, help="Random seed for repeatable output.")
    parser.add_argument("--output", choices=["text", "json"], default="text", help="Output format.")
    parser.add_argument("--list-cultures", action="store_true", help="List parsed cultures and exit.")
    parser.add_argument("--lore-file", type=Path, default=None, help="Optional override path to lore file.")
    parser.add_argument(
        "--languages-dir", type=Path, default=None, help="Optional override path to language folder."
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    rng = random.Random(args.seed)

    default_lore, default_lang = resolve_default_paths(Path(__file__))
    lore_file = args.lore_file or default_lore
    languages_dir = args.languages_dir or default_lang

    if not lore_file.exists():
        raise FileNotFoundError(f"Lore file not found: {lore_file}")
    if not languages_dir.exists():
        raise FileNotFoundError(f"Languages directory not found: {languages_dir}")

    lore_entries = parse_lore_file(lore_file)
    if not lore_entries:
        raise RuntimeError("No culture entries found in lore file.")

    if args.list_cultures:
        for culture in sorted(entry.culture for entry in lore_entries.values()):
            print(culture)
        return 0

    packs = load_languages(languages_dir)
    if not packs:
        raise RuntimeError("No usable language files found.")

    if args.culture:
        key = normalize_ascii(args.culture)
        entry = lore_entries.get(key)
        if entry is None:
            matches = [e for k, e in lore_entries.items() if key in k or k in key]
            if not matches:
                available = ", ".join(sorted(e.culture for e in lore_entries.values()))
                raise ValueError(f"Culture '{args.culture}' not found. Available: {available}")
            entry = matches[0]
    else:
        entry = rng.choice(list(lore_entries.values()))

    seeds: List[Dict[str, str]] = []
    for _ in range(max(1, args.count)):
        pack = pick_language_pack(entry.culture, packs, rng)
        seeds.append(generate_seed(entry, pack, rng))

    if args.output == "json":
        print(json.dumps(seeds, indent=2))
    else:
        print(render_text(seeds))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
