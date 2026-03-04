'''
Week 2: Calling Functions
Sister Hansen
'''

# built-in functions
# see a list here: https://docs.python.org/3/library/functions.html#built-in-functions

# parameters vs arguments

# def add2nums(num1, num2):
#     result = num1+num2
#     return result

# result_of_add2 = add2nums(4,6)
# a = 2
# b = 4
# r2 = add2nums(a,b)
# print(r2)

# optional arguments & default parameters

# named arguments
# print("hello", "goodbye", "thanks", sep = "!!!", end="Chris")
# functions in standard modules (modules we need to import, but not install)
#like import math or import random


# methods (functions we can use on an object - use object.method_name() )




### common gotcha: don't forget the () after a method

#### team activity: 
# datetime module (see Helpful Documentation in the Team Activity)
from datetime import datetime # instead of just import datetime
# if statements and conditions/logic
# math

#### stretch challenges: 
# more if statements and conditions/logic
# review while loops



# import datetime
# now = datetime.datetime.now()
# print(now)

# from datetime import datetime
# now = datetime.now()
# print(now)
# day = now.weekday()
# print(day)

# for the prove
# with open("volumes.txt", "at") as file:
#     print(f"{now:%Y-%m-%d}", file=file) # but prove asks for different format