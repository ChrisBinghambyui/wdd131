# 1. Name:
#      Chris Bingham 
# 2. Assignment Name:
#      Lab 02: Authentication
# 3. Assignment Description:
#      It's basically a login system, allowing users to log in if they enter a username and matching password
# 4. What was the hardest part? Be as specific as possible.
#      I've never imported json before, so I had to look up how to do that. It was a slog getting it to work just right, but finally I found a way to get it to work.
# 5. How long did it take for you to complete the assignment?
#      About 2 hours

import json

Lab02 = 'Lab02.json'

x=input("Enter your username: ")
y=input("Enter your password: ")

with open(r'c:\Users\chris\Downloads\Algorithm Design cse130\week2\Lab02.json', 'r') as unam:
    data = json.load(unam)

#index allows it to count and then check password for the string at the same position. 
user_found = False
for index, username in enumerate(data["username"]):
    if username == x:
        user_found = True
        if data["password"][index] == y:
            print("Authenticated")
        else:
            print("Access denied.")
        break
if not user_found:
    print("Access denied.")