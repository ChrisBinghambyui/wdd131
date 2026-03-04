import math

item = int(input("Enter the number of items: "))
boxl = int(input("Enter the limit of items per box: "))

def pack(x,y):
    z=math.ceil(x/y)
    print(f"For {x} items, packing {y} items in each box, you will need {z} boxes.")

# pack(item,boxl)