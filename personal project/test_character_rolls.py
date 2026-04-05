from character_rolls import clean_int, roll_dice, clean_damage_text, get_damage_bonus, find_json_file_path
import pytest
import os


def test_clean_int():
    assert clean_int(12) == 12
    assert clean_int(9.8) == 9
    assert clean_int("-45 hp") == -45
    assert clean_int("nothing") == 0


def test_clean_damage_text():
    assert clean_damage_text("2d6 slashing") == (2, 6, "slashing")
    assert clean_damage_text("1d10") == (1, 10, "")
    assert clean_damage_text("bad text") == (0, 0, "text")
    assert clean_damage_text("") == (0, 0, "")


def test_roll_dice_range():
    act_total, act_rolls = roll_dice(5, 6)

    assert len(act_rolls) == 5
    assert isinstance(act_total, int)
    assert act_total == sum(act_rolls)
    for roll in act_rolls:
        assert 1 <= roll <= 6


def test_get_damage_bonus():
    sample_character = {
        "derived": {
            "Melee Damage Bonus": 3,
            "Agility Damage Bonus": 2,
        }
    }

    assert get_damage_bonus(sample_character, "Marksman") == 2
    assert get_damage_bonus(sample_character, "Brawl") == 3


def test_clean_damage_text_bad_input():
    with pytest.raises(AssertionError):
        clean_damage_text(15)


def test_roll_dice_bad_inputs():
    with pytest.raises(AssertionError):
        roll_dice(-1, 6)

    with pytest.raises(AssertionError):
        roll_dice(2, 0)


def test_find_json_file_path_exact_and_unique_name(tmp_path, monkeypatch):
    exact_file = tmp_path / "hero.json"
    exact_file.write_text('{"name": "Hero"}', encoding="utf-8")

    nested_dir = tmp_path / "chars"
    nested_dir.mkdir()
    unique_file = nested_dir / "rogue.json"
    unique_file.write_text('{"name": "Rogue"}', encoding="utf-8")

    monkeypatch.chdir(tmp_path)

    act_path, act_suggestions = find_json_file_path(str(exact_file))
    assert os.path.normpath(act_path) == os.path.normpath(str(exact_file))
    assert act_suggestions == []

    act_path, act_suggestions = find_json_file_path("rogue.json")
    assert os.path.normpath(act_path) == os.path.normpath(os.path.relpath(unique_file, tmp_path))
    assert act_suggestions == []


def test_find_json_file_path_close_suggestion(tmp_path, monkeypatch):
    file_path = tmp_path / "dawnchurch.json"
    file_path.write_text('{"name": "Dawnchurch"}', encoding="utf-8")
    monkeypatch.chdir(tmp_path)

    act_path, act_suggestions = find_json_file_path("dawnchurh.json")
    assert act_path == ""
    assert len(act_suggestions) >= 1
    assert any("dawnchurch.json" in path for path in act_suggestions)


pytest.main(["-v", "--tb=line", "-rN", __file__])
