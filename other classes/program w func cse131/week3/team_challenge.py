def main():
    speed = int(input("What is your current speed? "))
    evaluation = determiner(speed)
    print(evaluation)
    pass

def determiner(x):
    if x <= 25:
        eval = "Too slow!"
    elif x >= 65:
        eval = "Too fast!"
    else:
        eval = "You good king."
    return eval

main()