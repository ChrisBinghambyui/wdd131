import math
dist = float(input("What is the distance of the trip (in miles)? "))
mpg = float(input("How many miles per gallon does the vehicle get on average? "))
price = float(input("What is the average gas price along your trip? "))
bud = float(input("What is your budget for the trip? "))

cost = (dist/mpg)*price

if cost>=bud:
    print("This trip exceeds your budget by ${(cost-bud):.2f}.")
elif cost<bud:
    print("You can afford the trip!")
    drivers=int(input("How many potential drivers are there?"))
    if drivers == 0:
        print("Not going anywhere bud.")
    elif drivers == 1:
        print("Enjoy your trip!")
    # elif drivers >= 2:
else:
    print("What?")