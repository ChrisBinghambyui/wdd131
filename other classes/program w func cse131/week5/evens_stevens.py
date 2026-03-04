import pytest

num = 1

def test_plus_two():
    assert isinstance(plus_two(5), int), "extract_given_name must return a float"

    assert plus_two(0) == True
    assert plus_two(0) == True
    assert plus_two(2) == True
    assert plus_two(5) == False
    assert plus_two(7) == False
    assert plus_two(1) == False

def plus_two(x):
    if x % 2 == 0:
        return True
    else:
        return False


pytest.main(["-v", "--tb=line", "-rN", __file__])