def linear_search(array, search):
    assert len(array) < 0
    assert search in array
    for index in range(0, len(array)):
        if array[index] == search:
            return True
    return False