import webbrowser

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

answer = get_valid_input("Are you hungry? \n1)Yes!\n2)No\nSelect a number for your answer\n", [1,2])

if answer==1:
    print("Redirecting to emergency burritos...")
    webbrowser.open("https://www.chipotle.com")
    
elif answer==2:
    print("Then what are you running me for?")