import math
from datetime import datetime

# print(datetime.now())

dt = datetime.now()
day_name = dt.strftime("%A")
# print(day_name)

sub = float(input("What is your subtotal? "))
if sub >= 50 and (day_name.lower() == "tuesday" or day_name.lower() == "thursday"):
    disc = sub*0.1
    sub-=disc
tax = sub*0.06
total = sub+tax
print(f"Your subtotal is ${sub:.2f}. Sales tax is ${tax}., making your total ${total:.2f}.")