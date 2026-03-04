data = [ 26, 6, 90, 55 ]
length = len(data)

# {
#   "array": [ "26", "6", "90", "55" ]  #A
# }

print(f'{"Row Name":<10} {"i":>5}, {"j":>5}, {"Data":>10}')

for i in range(length - 1): #B
    for j in range(length - i - 1):  #C    
        if data[j] > data[j + 1]: #D
            data[j], data[j + 1] = data[j + 1], data[j] #E
            print(f'{"Row 1":<10} {i:>5}, {j:>5}, {data}')
        print(f'{"Row 1":<10} {i:>5}, {j:>5}, {data}')
    print(f'{"Row 1":<10} {i:>5}, {j:>5}, {data}')

print(data)

# We went over this approach in class, but we take a list of unsorted numbers and start by looking at the last one. When it finds a number smaller than the one that precedes it in the list, it swaps them. This repeats a number of times equal to the length of the list minus one, which while technically not telling it to go until properly sorted since that's not the criteria, it does end up working. A more complex list might need a different criteria.

# My pseudocode:
# SET list to [7, 1, 4, 2, 9, 3, 5, 10, 99, 99, 100, -292, 85, 0]
# SET length ← LENGTH(list)

# OUTPUT f'{"Row Name":<10} {"i":>5}, {"j":>5}, {"list":>10}'

# FOR EACH item FROM 0 TO (length - 1) DO
#     FOR EACH itemj FROM 0 TO (length - item - 1) DO 
#         IF list[itemj] > list[itemj + 1] THEN
#             SET list[itemj], list[itemj + 1] TO list[itemj + 1], list[itemj]
#               OUTPUT f'{"Row 1":<10} {i:>5}, {j:>5}, {list}
#           OUTPUT f'{"Row 1":<10} {i:>5}, {j:>5}, {list}
#       OUTPUT f'{"Row 1":<10} {i:>5}, {j:>5}, {list}

#       OUTPUT list

# copilot solution:

# procedure SimpleSwapSort(list):
#     n ← length(list)

#     repeat (n - 1) times:
#         for i ← n-1 down to 1:
#             if list[i] < list[i-1]:
#                 swap(list[i], list[i-1])

#     return list

    # Provide an analysis as to the pros and cons of the two solutions?
        # Mine is slower and more careful i think, and the copilot solution is more efficient but doesn't do any printing.
    # How can your solution be improved based on what Copilot provided?
        # their use of the for each section was much shorter than mine, I could probably condense it much better
    # How can Copilot's solution be improved based on what you know?
        # it doesn't print anything out
    # Does the pseudocode in Step 3 and Step 4 match the algorithm you performed in Step 1?
        # Almost, again it doesn't do any printing, and it doesn't technically have to FOR loops, but i think the repeat function does essentially the same thing 