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

def main():
    owns_all_input = get_valid_input("Do you own all the green properties? (1:yes, 0:no) ", [0, 1])
    if owns_all_input == 0:
        return print("Out: No Properties\nYou cannot purchase a hotel until you own all the properties of a given color group.")
    
    pc = get_valid_input("What is on Pacific Avenue? (0:nothing, 1:one house, ... 5:a hotel) ", [0, 1, 2, 3, 4, 5])
    nc = get_valid_input("What is on North Carolina Avenue? (0:nothing, 1:one house, ... 5:a hotel) ", [0, 1, 2, 3, 4, 5])
    pa = get_valid_input("What is on Pennsylvania Avenue? (0:nothing, 1:one house, ... 5:a hotel) ", [0, 1, 2, 3, 4, 5])
    
    if pa == 5:
        return print("Out: Own Hotel\nYou cannot purchase a hotel if the property already has one.")
    elif pa == 4 and (pc == 5 or nc == 5):
        if pc == 5:
            return print("Out: Swap PC\nSwap Pacific's hotel with Pennsylvania's 4 houses.")
        elif nc == 5:
            return print("Out: Swap NC\nSwap North Carolina's hotel with Pennsylvania's 4 houses.")
    
    pan = 4 - pa
    ncn = 4 - nc
    pcn = 4 - pc
    totaln = pan + ncn + pcn
    
    if totaln>0:
        houses = get_valid_input("How many houses are there to purchase? ", list(range(0, 33)))
        if totaln > houses:
            return print("Out: Not enough houses\nThere are not enough houses available for purchase at this time.")
    
    hotels = get_valid_input("How many hotels are there to purchase? ", list(range(0, 13)))
    if hotels < 1:
        return print("Out: Not enough hotels\nThere are not enough hotels available for purchase at this time.")
    
    cost = totaln * 200 + 200
    cash = get_valid_input("How much cash do you have to spend? ", list(range(0, 10000)))
    if cost > cash:
        return print("Out: Cash\nYou do not have sufficient funds to purchase a hotel at this time.")
    
    if pa < 4:
        if pc == 5 and nc < 4 and (totaln * 200 + 200) <= cash:
            return print("Out: Swap PC\nSwap Pacific's hotel with Pennsylvania's 4 houses.")
        if nc == 5 and pc < 4 and (totaln * 200 + 200) <= cash:
            return print("Out: Swap NC\nSwap North Carolina's hotel with Pennsylvania's 4 houses.")
    
    # purchase_type = "ABCD"[2 * (ncn > 0) + (pcn > 0)]
    print(f"Out: Purchase")
    print(f"This will cost ${cost}.")
    print(f"Purchase 1 hotel and {totaln} house(s).")
    print("Put 1 hotel on Pennsylvania and return any houses to the bank.")
    if ncn > 0:
        print(f"Put {ncn} house(s) on North Carolina.")
    if pcn > 0:
        print(f"Put {pcn} house(s) on Pacific.")

main()