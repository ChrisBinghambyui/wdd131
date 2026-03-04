# w is width, a is aspect ratio, d is diameter in inches
import math
from datetime import datetime

cdate = datetime.now().strftime("%Y-%m-%d")

print("Thank you for choosing Rexburg Tires!\nPlease input the size of tire you are interested in.")

finished = 0

base = 50

while finished!=1:
    w = float(input("Width in mm: "))
    a = float(input("Aspect Ratio: "))
    d = float(input("Diameter in inches: "))

    top = math.pi * (w*w) * a * (w*a+2540*d)

    v = top/10000000000

    print(f"The approximate volume of the tire is {v:.2f} liters.")
    print(f"Tire size: {int(w)}/{int(a)}R{int(d)}")

    wc = (w/200)*15
    if a>=50:
        ac = 30
    else:
        ac = 0
    dc = (d/15)*20

    total = base + wc + ac + dc

    print(f"The price of these tires are an estimated {total:.2f}$ per tire.")
    # stuff = [cdate, w, a, d, v]
    finish = int(input("Do you want to purchase these tires?\n1)Yes - go forward with purchase\n2)No - keep browsing\n3)Exit\n"))
    if finish == 3 or finish == 1:
        finished = 1



if finish == 1:
    info = input("Please enter your name and contact info so we can contact you once your order is ready for pickup: ")
    with open("volumes.txt", "a") as volumes:
        # volumes.write(cdate+str(w)+str(a)+str(d)+str(v))
        # print(f"{cdate}"+"{str(w)}"+"}str(a)}"+"}str(d)}"+"{str(v)}", file=volumes)
        print(f"{cdate}, {int(w)}, {int(a)}, {int(d)}, {v:.2f}, {info}", file=volumes)
print("Thank you for choosing to visit Rexburg Tires today!")
    