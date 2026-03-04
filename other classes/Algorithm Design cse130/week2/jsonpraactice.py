import json

my_friend = {
    "Name" : "Jeannie",
    "Phone" : 8675309,
    "Address" : "555 Cherry Lane",
    "Friends" : ["Bob", "Betty", "Bubba", "Alice"]
}

print(my_friend)

print (my_friend["Name"])

# Can create a new json file. in ".dumps", the s stands for str. 

with open('jsonpractice.json', 'wt') as file_handle:
    json_data = json.dumps(my_friend)
    print(json_data)
    file_handle.write(json_data)