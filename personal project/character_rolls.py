import json
import os
import random
import difflib


def read_character_file(file_name):
    with open(file_name, "r", encoding="utf-8") as file:
        character_dict = json.load(file)
    assert type(character_dict) == dict, "Character file root must be a JSON object."
    return character_dict


def find_json_file_path(user_input):
    assert type(user_input) == str, "user_input must be a string."

    raw_text = user_input.strip().strip('"').strip("'")
    if raw_text == "":
        return "", []

    normalized = os.path.normpath(raw_text)
    if os.path.isfile(normalized):
        return normalized, []

    if os.path.isfile(raw_text):
        return raw_text, []

    file_name = os.path.basename(normalized)
    if file_name == "":
        return "", []

    matches = []
    all_json_paths = []

    for root, _, files in os.walk("."):
        for file in files:
            if file.lower().endswith(".json") == False:
                continue

            full_path = os.path.normpath(os.path.join(root, file))
            all_json_paths.append(full_path)

            if file.lower() == file_name.lower():
                matches.append(full_path)

    if len(matches) == 1:
        return matches[0], []

    if len(matches) > 1:
        return "", matches[:5]

    candidate_names = [os.path.basename(path) for path in all_json_paths]
    close_names = difflib.get_close_matches(file_name, candidate_names, n=5, cutoff=0.6)

    close_paths = []
    for close_name in close_names:
        for path in all_json_paths:
            if os.path.basename(path) == close_name and path not in close_paths:
                close_paths.append(path)

    return "", close_paths


def clean_int(value):
    if type(value) == int:
        return value

    if type(value) == float:
        return int(value)

    if type(value) == str:
        text = ""
        for char in value:
            if char.isdigit() or (char == "-" and text == ""):
                text += char

        if text != "" and text != "-":
            return int(text)

    return 0


def prompt_number_choice(max_number, prompt_text):
    assert type(max_number) == int and max_number >= 1, "max_number must be an integer >= 1."
    assert type(prompt_text) == str and prompt_text != "", "prompt_text must be a non-empty string."
    choice_num = 0

    while choice_num < 1 or choice_num > max_number:
        choice = input(prompt_text).strip()
        if choice.isdigit() == False:
            print("Enter a valid number.")
        else:
            choice_num = int(choice)
            if choice_num < 1 or choice_num > max_number:
                print("Number out of range.")

    return choice_num


def choose_list_item(item_list, title_text):
    if len(item_list) == 0:
        return ""

    print("\n" + title_text)
    for i in range(len(item_list)):
        print(f"{i + 1}. {item_list[i]}")

    choice_num = prompt_number_choice(len(item_list), "Choose a number: ")
    return item_list[choice_num - 1]


def roll_dice(number_of_dice, dice_sides):
    assert type(number_of_dice) == int and number_of_dice >= 0, "number_of_dice must be an integer >= 0."
    assert type(dice_sides) == int and dice_sides >= 1, "dice_sides must be an integer >= 1."
    total = 0
    roll_list = []

    for _ in range(number_of_dice):
        roll = random.randint(1, dice_sides)
        total += roll
        roll_list.append(roll)

    return total, roll_list


def parse_damage_text(damage_text):
    assert type(damage_text) == str, "damage_text must be a string."
    if damage_text == "":
        return 0, 0, ""

    parts = damage_text.split()
    if len(parts) == 0:
        return 0, 0, ""

    dice_text = parts[0].lower()
    damage_type = ""
    if len(parts) > 1:
        damage_type = " ".join(parts[1:])

    if "d" not in dice_text:
        return 0, 0, damage_type

    split_text = dice_text.split("d")
    if len(split_text) != 2:
        return 0, 0, damage_type

    if split_text[0].isdigit() == False or split_text[1].isdigit() == False:
        return 0, 0, damage_type

    number_of_dice = int(split_text[0])
    dice_sides = int(split_text[1])
    return number_of_dice, dice_sides, damage_type


def get_sorted_skill_names(character_dict):
    assert type(character_dict) == dict, "character_dict must be a dictionary."
    skills_dict = character_dict.get("skills", {})
    assert type(skills_dict) == dict, "skills must be a dictionary when present."
    skill_names = list(skills_dict.keys())
    skill_names.sort()
    return skill_names


def prompt_difficulty_modifier():
    modifier_input = input("Difficulty modifier (easy is negative, hard is positive): ").strip()
    if modifier_input == "":
        return 0
    return clean_int(modifier_input)


def print_skill_check_result(chosen_skill, target_number, roll, modifier):
    adjusted_roll = roll + modifier

    print("\nResult")
    print(f"Skill: {chosen_skill}")
    print(f"Target Number: {target_number}")
    print(f"Roll: {roll}")
    print(f"Modifier: {modifier:+d}")
    print(f"Adjusted Roll: {adjusted_roll}")

    if adjusted_roll <= target_number:
        print("Outcome: SUCCESS")
    else:
        print("Outcome: FAILURE")


def do_skill_check(character_dict):
    skill_names = get_sorted_skill_names(character_dict)
    if len(skill_names) == 0:
        print("No skills were found in this character file.")
        return

    chosen_skill = choose_list_item(skill_names, "Skill Check")
    if chosen_skill == "":
        return

    skills_dict = character_dict.get("skills", {})
    skill_value = clean_int(skills_dict.get(chosen_skill, 0))
    roll = random.randint(1, 100)
    modifier = prompt_difficulty_modifier()
    print_skill_check_result(chosen_skill, skill_value, roll, modifier)


def get_character_weapon(character_dict):
    assert type(character_dict) == dict, "character_dict must be a dictionary."
    equipment_dict = character_dict.get("selectedEquipment", {})
    assert type(equipment_dict) == dict, "selectedEquipment must be a dictionary when present."
    weapon = equipment_dict.get("weapon", {})

    if type(weapon) == dict:
        return weapon

    return {}


def get_damage_bonus(character_dict, weapon_skill):
    assert type(character_dict) == dict, "character_dict must be a dictionary."
    assert type(weapon_skill) == str, "weapon_skill must be a string."
    derived_dict = character_dict.get("derived", {})
    assert type(derived_dict) == dict, "derived must be a dictionary when present."
    melee_bonus = clean_int(derived_dict.get("Melee Damage Bonus", 0))
    agility_bonus = clean_int(derived_dict.get("Agility Damage Bonus", 0))

    if weapon_skill == "Marksman":
        return agility_bonus

    return melee_bonus


def choose_attack_type(weapon_dict):
    assert type(weapon_dict) == dict, "weapon_dict must be a dictionary."
    attack_name_list = []
    attack_damage_list = []

    primary_text = weapon_dict.get("primary", "")
    secondary_text = weapon_dict.get("secondary", "")

    if primary_text != "":
        attack_name_list.append("Primary")
        attack_damage_list.append(primary_text)

    if secondary_text != "":
        attack_name_list.append("Secondary")
        attack_damage_list.append(secondary_text)

    if len(attack_name_list) == 0:
        return "", ""

    show_list = []
    for i in range(len(attack_name_list)):
        show_list.append(f"{attack_name_list[i]} ({attack_damage_list[i]})")

    chosen_show = choose_list_item(show_list, "Attack Type")
    if chosen_show == "":
        return "", ""

    chosen_index = show_list.index(chosen_show)
    return attack_name_list[chosen_index], attack_damage_list[chosen_index]


def print_attack_result(weapon_name, weapon_skill, skill_value, attack_type, damage_text, fp_cost, hit_roll, hit_success, damage_rolls, damage_bonus, damage_total, damage_type):
    print("\nAttack Result")
    print(f"Weapon: {weapon_name}")
    print(f"Skill Used: {weapon_skill} ({skill_value})")
    print(f"Attack Type: {attack_type}")
    print(f"Damage Entry: {damage_text}")
    print(f"FP Cost: {fp_cost}")
    print(f"Hit Roll: {hit_roll}")

    if hit_success:
        print("Outcome: HIT")
        if len(damage_rolls) > 0:
            print(f"Damage Dice: {damage_rolls}")
            print(f"Damage Bonus: {damage_bonus:+d}")
            print(f"Total Damage: {damage_total} {damage_type}".strip())
        else:
            print("Could not parse the weapon damage dice.")
    else:
        print("Outcome: MISS")


def do_attack_roll(character_dict):
    weapon_dict = get_character_weapon(character_dict)
    if len(weapon_dict) == 0:
        print("No weapon was found in selectedEquipment.weapon.")
        return

    weapon_name = weapon_dict.get("name", "Unknown Weapon")
    weapon_skill = weapon_dict.get("skill", "")
    fp_cost = weapon_dict.get("fp", "?")

    skills_dict = character_dict.get("skills", {})
    skill_value = clean_int(skills_dict.get(weapon_skill, 0))

    attack_type, damage_text = choose_attack_type(weapon_dict)
    if attack_type == "":
        print("No attack profile found on this weapon.")
        return

    number_of_dice, dice_sides, damage_type = parse_damage_text(damage_text)

    hit_roll = random.randint(1, 100)
    hit_success = hit_roll <= skill_value
    damage_bonus = get_damage_bonus(character_dict, weapon_skill)

    damage_total = 0
    damage_rolls = []

    if hit_success and number_of_dice > 0 and dice_sides > 0:
        damage_total, damage_rolls = roll_dice(number_of_dice, dice_sides)
        damage_total += damage_bonus

    print_attack_result(
        weapon_name,
        weapon_skill,
        skill_value,
        attack_type,
        damage_text,
        fp_cost,
        hit_roll,
        hit_success,
        damage_rolls,
        damage_bonus,
        damage_total,
        damage_type,
    )


def show_main_menu():
    print("\nMenu")
    print("1. Roll skill check")
    print("2. Roll attack")
    print("3. Quit")


def run_menu(character_dict):
    menu_choice = ""
    while menu_choice != "3":
        show_main_menu()
        menu_choice = input("Choose an option: ").strip()

        if menu_choice == "1":
            do_skill_check(character_dict)
        elif menu_choice == "2":
            do_attack_roll(character_dict)
        elif menu_choice == "3":
            print("Good luck, adventurer.")
        else:
            print("Please enter 1, 2, or 3.")


def load_character_from_user():
    max_attempts = 5
    attempt_count = 0

    while attempt_count < max_attempts:
        file_name = input("\nPath to character .json file: ").strip()
        if file_name == "":
            print("No file path entered.")
            attempt_count += 1
            continue

        resolved_path, suggestions = find_json_file_path(file_name)

        if resolved_path == "":
            print("Could not find that file path.")
            if len(suggestions) > 0:
                print("Did you mean one of these?")
                for suggestion in suggestions:
                    print(f"- {suggestion}")

            attempt_count += 1
            if attempt_count < max_attempts:
                print("Try again.")
            continue

        try:
            character_dict = read_character_file(resolved_path)
        except json.JSONDecodeError:
            print("That file is not valid JSON.")
            attempt_count += 1
            if attempt_count < max_attempts:
                print("Try again.")
            continue

        return character_dict

    print("Too many failed attempts.")
    return None


def main():
    print("Scrolls and Steel Roll Tool")
    print("Load a character .json file and roll checks or attacks.")

    character_dict = load_character_from_user()
    if character_dict is None:
        return

    character_name = character_dict.get("name", "Unnamed Adventurer")
    print(f"\nLoaded: {character_name}")

    run_menu(character_dict)


if __name__ == "__main__":
    main()
