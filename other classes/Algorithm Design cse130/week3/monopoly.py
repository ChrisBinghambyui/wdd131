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

print("1 for yes, 2 for no")

turn = get_valid_input("Is it your turn? 1)Yes, 2)No", [1, 2])
wallet = int(input("How much money do you have?"))
PAA = int(get_valid_input("What is on Pacific Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
NCA = int(get_valid_input("What is on North Carolina Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
PNA = int(get_valid_input("What is on Pennsylvania Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
house = int(input("How many houses are in the bank? "))
hotel = int(input("How many hotels are in the bank? "))



if turn == 1:
    own = get_valid_input("Do you own all 3 properties (Penn, PA ave, NC ave)? ")
    if own == 2:
        print("You cannot place a hotel on Pennsylvania Avenue. Acquire the rest of the properties first.")
    elif own == 1:
        print("It is your turn.")
        wallet = int(input("How much money do you have?"))
        PAA = int(get_valid_input("What is on Pacific Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
        NCA = int(get_valid_input("What is on North Carolina Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
        PNA = int(get_valid_input("What is on Pennsylvania Avenue? (0:nothing, 1:one house, ... 5:a hotel) "))
        house = int(input("How many houses are in the bank? "))
        hotel = int(input("How many hotels are in the bank? "))
        
