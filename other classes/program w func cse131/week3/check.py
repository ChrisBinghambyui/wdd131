def miles_per_gallon(end, start, gallons):
    mpg = (end-start)/gallons
    return mpg

def lp100k_from_mpg(mpg):
    x = 235.215/mpg
    return x

def main():
    st = int(input("Starting odometer: "))
    en = int(input("Ending odometer: "))
    ga = float(input("Fuel in gallons: "))
    mpg = miles_per_gallon(en, st, ga)
    lit = lp100k_from_mpg(mpg)
    print(f"Your fuel efficiency is {mpg:.1f} mpg, or {lit:.2f} liters per 100 kilometers.")
    

main()