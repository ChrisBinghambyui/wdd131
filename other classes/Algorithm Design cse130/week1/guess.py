# 1. Name:
#      Chris Bingham
# 2. Assignment Name:
#      Lab 01: Guessing Game
# 3. Assignment Description:
#      Make a guessing game with python
# 4. What was the hardest part? Be as specific as possible.
#      I don't know, this was a pretty easy introductory assignment. I'm a nerd and wanted to go above and beyond, and naturally that gave me some trouble, but the core reqs was all stuff we hammered in last semester.
# 5. How long did it take for you to complete the assignment?
#      Maybe an hour

import random
print("Number guessing game!")
# d=input("Debug? ")
# x=0
# if d == "y" or d.lower() == "debug":
#     x=int(input("What number do you want to test? "))
# else:
#     low=int(input("What do you want to be the lowest possible number? "))
#     hig=int(input("What do you wannt to be the highest possible number? "))
#     x=random.randint(low, hig)

x=int(input("What number do you want to test? "))

g=0
a=-1
l=[]
while a != x:
    a=int(input("What is your next guess? \033[1;4m"))
    g+=1
    if a > x:
        print("\033[0m\tToo high!")
    elif a<x:
        print("\033[0m\tToo low!")
    l.append(a)
print("\033[0mYou got it!")
print(f"It took you {g} tries.")
print(f"The numbers you guessed were: {l}")
# Yeah I know I didn't need to do the bold underline thing, but I felt like learninng how to do it since I had time.