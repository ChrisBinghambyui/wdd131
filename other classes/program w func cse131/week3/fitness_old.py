# Import datetime so that it can be
# used to compute a person's age.
from datetime import datetime
import math

def main():
    gender = input("Enter the gender (M/F): ")
    birthdate = input("Enter the birthdate (YYYYMMDD): ")
    weight = float(input("Enter the weight in U.S. pounds: "))
    height = float(input("Enter the height in U.S. inches: "))
    # Get the user's gender, birthdate, height, and weight.
    age = compute_age(birthdate)
    kg = kg_from_lb(weight)
    cm = cm_from_in(height)

    bmi = body_mass_index(kg, cm)
    bmr = basal_metabolic_rate(gender, kg, cm, height)

    # Call the compute_age, kg_from_lb, cm_from_in,
    # body_mass_index, and basal_metabolic_rate functions
    # as needed.
    print(f"Age: {age}\nWeight (kg): {kg:.2f}\nHeight (cm): {cm:.1f}")
    print(f"The patient's BMI is {bmi:.1f}, and their BMR is {round(bmr)}")
    # Print the results for the user to see.
    pass


def compute_age(birth_str):
    """Compute and return a person's age in years.
    Parameter birth_str: a person's birthdate stored
        as a string in this format: YYYY-MM-DD
    Return: a person's age in years.
    """
    # Convert a person's birthdate from a string
    # to a date object.
    birthdate = datetime.strptime(birth_str, "%Y-%m-%d")
    today = datetime.now()

    # Compute the difference between today and the
    # person's birthdate in years.
    years = today.year - birthdate.year

    # If necessary, subtract one from the difference.
    if birthdate.month > today.month or \
        (birthdate.month == today.month and \
            birthdate.day > today.day):
        years -= 1

    return years


def kg_from_lb(pounds):
    """Convert a mass in pounds to kilograms.
    Parameter pounds: a mass in U.S. pounds.
    Return: the mass in kilograms.
    """
    kg = pounds * 0.45359237
    return kg


def cm_from_in(inches):
    """Convert a length in inches to centimeters.
    Parameter inches: a length in inches.
    Return: the length in centimeters.
    """
    cm = inches * 2.54
    return cm


def body_mass_index(weight, height):
    """Compute and return a person's body mass index.
    Parameters
        weight: a person's weight in kilograms.
        height: a person's height in centimeters.
    Return: a person's body mass index.
    """
    bmi = (10000*weight)/(height*height)
    return bmi


def basal_metabolic_rate(gender, weight, height, age):
    """Compute and return a person's basal metabolic rate.
    Parameters
        weight: a person's weight in kilograms.
        height: a person's height in centimeters.
        age: a person's age in years.
    Return: a person's basal metabolic rate in kcals per day.
    """
    if gender.lower()=="f":
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    elif gender.lower()=="m":
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    return bmr


# Call the main function so that
# this program will start executing.


# def get_valid_input(prompt, valid_options):
#     """Get input from user and validate it's in valid_options list"""
#     valid = False
#     choice = None
    
#     while not valid:
#         try:
#             choice = int(input(prompt))
#             if choice in valid_options:
#                 valid = True
#             else:
#                 print(f"Invalid choice. Please enter one of: {valid_options}")
#         except ValueError:
#             print("Invalid input. Please enter a number.")
    
#     return choice

# Body mass index (BMI) is a person’s weight in kilograms divided by the square of their height in meters. BMI can be used to screen for weight categories such as underweight, normal, overweight, and obese that may lead to health problems. However, BMI is not diagnostic of the body fatness or health of an individual.
# The formula for computing BMI is

# bmi = 10,000 weight in kg/height in cm^2


# Basal metabolic rate (BMR) is the minimum number of calories required daily to keep your body functioning at rest. BMR is different for women and men and changes with age. The revised Harris-Benedict formulas for computing BMR are...

# (women)  bmr = 447.593 + 9.247 weight + 3.098 height − 4.330 age
# (men)  bmr = 88.362 + 13.397 weight + 4.799 height − 5.677 age

# g = get_valid_input("Enter the gender (M/F): ", ["M", "m", "F", "f"])
# b = int(input("Enter the birthdate (YYYYMMDD): "))
# w = get_valid_input("Enter the weight in U.S. pounds: ", float())
# h = get_valid_input("Enter the height in U.S. inches: ", float())

# cw = w*0.45359237
# ch = h*2.54

main()