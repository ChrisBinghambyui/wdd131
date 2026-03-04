from names import make_full_name, \
    extract_family_name, extract_given_name
import pytest

def test_make_full_name():
    full_name = make_full_name("Sally", "Brown")
    assert isinstance(full_name, str), "fullname function must return a string"

    assert make_full_name("", "") == ";"
    assert make_full_name("", "Chris") == "Chris;"
    assert make_full_name("Chris", "") == ";Chris"
    assert make_full_name("Chris", "Bingham") == "Bingham;Chris"

def test_extract_family_name():
    assert isinstance(extract_family_name("Brown; Sally"), str), "extract_family_name must return a string"

    assert extract_family_name("; ") == ""
    assert extract_family_name("Brown; ") == "Brown"
    assert extract_family_name("; Sally") == ""
    assert extract_family_name("Brown; Sally") == "Brown"

def test_extract_given_name():
    assert isinstance(extract_given_name("Brown; Sally"), str), "extract_given_name must return a string"

    assert extract_given_name("; ") == ""
    assert extract_given_name("Brown; ") == ""
    assert extract_given_name("; Sally") == "Sally"
    assert extract_given_name("Brown; Sally") == "Sally"






# Call the main function that is part of pytest so that the
# computer will execute the test functions in this file.
pytest.main(["-v", "--tb=line", "-rN", __file__])
