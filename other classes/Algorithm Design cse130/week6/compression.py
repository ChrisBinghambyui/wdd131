# 1. Name:
#      Chris Bingham
# 2. Assignment Name:
#      Lab 06: Image Compression
# 3. Assignment Description:
#      Compress/decompress a picture
# 4. Algorithmic Efficiency
#      I think this is O(n), because it's a steady increase, not exact or flat, but consistenly being around 5-10 in increase each time.
# 5. What was the hardest part? Be as specific as possible.
#      Honestly trying to get this into excel and make a graph, excel kept trying to put it into columns and not transpose, and then make the most illegible charts possible lol.
# 6. How long did it take for you to complete the assignment?
#      About 2 hours

data = [
[1,8,1,2,1,2,1,5,1],
[10,2,1,2,7],
[10,2,1,2,7],
[10,2,1,2,1,5,1],
[10,2,1,9],

[10,2,1,9],
[10,2,1,9],
[2,2,2,2,2,2,1,9],
[2,2,2,2,2,2,1,9],
[2,2,2,2,2,2,1,2,1,5,1],

[2,2,2,2,2,2,1,2,7],
[2,2,2,2,2,2,1,2,1,5,1],
[10,2,1,2,1,5,1],
[10,2,1,2,1,5,1],
[10,2,1,2,1,5,1],

[10,2,1,2,1,5,1],
[0,1,3,2,3,3,1,2,2,3,2],
[0,1,3,2,3,3,1,3,2,1,2,1],
[0,12,1,4,3,2],
[1,11,1,9],

[1,11,1,9],
[2,10,1,8,1],
[3,9,1,8,1],
[4,8,1,7,2],
[5,7,1,5,2,1,1],

[6,3,1,2,1,3,3,3],
[7,2,1,2,1,2,2,1,1,3],
[1,1,8,2,1,3,3,3],
[0,3,7,2,1,5,2,1,1],
[0,4,6,2,1,7,2],

[0,3,7,2,1,8,1],
[1,1,8,2,1,8,1],
[7,2,1,2,1,9],
[6,3,1,2,1,9],
[5,7,1,9],

[4,8,1,2,1,5,1],
[3,9,1,2,7],
[2,10,1,2,1,2,1,2,1],
[1,11,1,5,1,3],
[1,11,1,5,1,3],

[0,12,1,5,1,3],
[1,11,1,5,1,3],
[8,4,1,5,1,3],
[9,3,1,2,1,2,1,2,1],
[9,3,1,2,7],

[10,2,1,2,1,5,1],
[10,2,1,9],
[10,2,1,9],
[1,6,3,2,1,9],
[0,8,2,2,1,9],

[0,8,2,2,1,4,3,2],
[0,8,2,2,1,3,2,1,2,1],
[0,8,2,2,1,2,2,3,2],
[0,8,2,2,1,2,1,5,1],
[1,6,3,2,1,2,1,5,1],

[10,2,1,2,1,5,1],
[10,2,1,2,1,5,1],
[10,2,1,2,1,5,1],
[9,3,1,2,2,3,2],
[9,3,1,3,2,1,2,1],

[8,4,1, 4,3,2],
[1,11,1,9]

]

counter = 0
counters = []

for row in data:
    for column_index, value in enumerate(row):
        counter += 1
        if column_index % 2 == 0:
            print(" " * value, end="")
        else:
            print("#" * value, end="")
    print(counter)
    counters.append(counter)

print(counters)