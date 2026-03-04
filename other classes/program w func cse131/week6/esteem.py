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

print("For each question, respond with 1-4 as follows:\n1)Strongly Disagree\n2)Disagree\n3)Agree\n4)Strongly Agree")

q1 = get_valid_input("I feel that I am a person of worth, at least on an equal plane with others. ", [1, 2, 3, 4])
q2 = get_valid_input("I feel that I have a number of good qualities. ", [1, 2, 3, 4])
q3 = get_valid_input("All in all, I am inclined to feel that I am a failure. ", [1, 2, 3, 4])
q4 = get_valid_input("I am able to do things as well as most other people. ", [1, 2, 3, 4])
q5 = get_valid_input("I feel I do not have much to be proud of. ", [1, 2, 3, 4])
q6 = get_valid_input("I take a positive attitude toward myself. ", [1, 2, 3, 4])
q7 = get_valid_input("On the whole, I am satisfied with myself. ", [1, 2, 3, 4])
q8 = get_valid_input("I wish I could have more respect for myself. ", [1, 2, 3, 4])
q9 = get_valid_input("I certainly feel useless at times. ", [1, 2, 3, 4])
q10 = get_valid_input("At times I think I am no good at all. ", [1, 2, 3, 4])

positive_questions = [q1, q2, q4, q6, q7]
negative_questions = [q3, q5, q8, q9, q10]

score = 0

for i in positive_questions:
    score += i-1

for i in negative_questions:
    if i == 1:
        score+=3
    elif i == 2:
        score += 2
    elif i == 3:
        score += 1
    elif i == 4:
        score += 0

if score <=15:
    print("Your score reflects a potentially problematic self-esteem. Consider reaching out to a therapist.")
else:
    print(f"Your score was {score}.")