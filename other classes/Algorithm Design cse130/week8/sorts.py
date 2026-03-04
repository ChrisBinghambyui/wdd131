# 1. Name:
#      Chris Bingham
# 2. Assignment Name:
#      Lab 08: Sort
# 3. Assignment Description:
#      import a file then sort it alphabetically
# 4. What was the hardest part? Be as specific as possible.
#      I had to look up how to use pathlib because I've never used it before and it seemed to be the easiest route for importing. I also spent waaaaay too long with the bubble sort chunk before realizing that it was literally still just a < > usage. I imported my get_valid_input function because that makes testing things nice and quick and it works wonders for me, though it wasn't required.
# 5. How long did it take for you to complete the assignment?
#      ~hour and a half, not counting a helldivers break cuz the boys were on

import json
from pathlib import Path


def get_valid_input(prompt, valid_options):
    """Get input from user and validate it's in valid_options list"""
    valid = False
    choice = None
    
    while not valid:
        try:
            choice = int(input(prompt))
            if choice in valid_options:
                valid = True
            else:
                print(f"Invalid choice. Please enter one of: {valid_options}")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    return choice


files = {
    1: "Lab08.cities.json",
    2: "Lab08.empty.json",
    3: "Lab08.languages.json",
    4: "Lab08.states.json",
    5: "Lab08.trivial.json",
}

x = get_valid_input("1) cities\n2) empty\n3) languages\n4) states\n5) trivial\n\t>", [1, 2, 3, 4, 5])
assert isinstance(x, int)
assert 1 <= x <= 5

file1 = files[x]
assert isinstance(file1, str)

json_path = Path(__file__).parent / file1
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

assert isinstance(data, dict)
assert "array" in data
data2 = data["array"]
assert isinstance(data2, list)

print(f"Loaded: {file1}")
print(f"unsorted data: {data2}")

for i in range(len(data2)):
    for icheck in range(len(data2) - i - 1):
        if str(data2[icheck]).lower() > str(data2[icheck + 1]).lower():
            data2[icheck], data2[icheck + 1] = data2[icheck + 1], data2[icheck]


print(f"sorted data: {data2}")