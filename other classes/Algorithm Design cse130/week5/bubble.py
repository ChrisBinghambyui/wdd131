bubbles = [99, 7, 19, 6, 33, 19, 1, 0, 9000, 95954, 51, 67, 81, 21]

for i in range(len(bubbles)):
    for icheck in range(len(bubbles) - i - 1):
        if bubbles[icheck] > bubbles[icheck + 1]:
            bubbles[icheck], bubbles[icheck + 1] = bubbles[icheck + 1], bubbles[icheck]

print("Sorted array:", bubbles)