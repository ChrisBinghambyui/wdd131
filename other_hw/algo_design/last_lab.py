# 1. Name:
#      Chris Bingham
# 2. Assignment Name:
#      Lab 13: Power
# 3. Assignment Description:
#      Get the average power among a sub-array of a larger array
# 4. What was the hardest part? Be as specific as possible.
#      I am NOT good at getting my python files to grab other files. Sometimes it accepts just the file name, other times it needs the whole path, and with how many times I've had to reinstall VSCode and transfer computers i'm not sure how much of it is me being dumb or just missing a step in the install or what.
# 5. How long did it take for you to complete the assignment?
#      like 2.5 hrs


import json


def get_arr(filename):
	try:
		with open(filename, "r", encoding="utf-8") as file:
			data = json.load(file)
	except FileNotFoundError:
		print(f"Error: The file '{filename}' does not exist.")
		return None
	except json.JSONDecodeError:
		print("Error: The file is not valid JSON format.")
		return None
	except OSError as error:
		print(f"Error: Could not open the file. Details: {error}")
		return None

	if not isinstance(data, dict):
		print("Error: JSON content must be an object with an 'array' key.")
		return None

	if len(data) == 0:
		print("Error: JSON object is empty.")
		return None

	if next(iter(data)) != "array":
		print("Error: The first key in the JSON object must be 'array'.")
		return None

	if "array" not in data:
		print("Error: JSON object must contain an 'array' key.")
		return None

	power_array = data["array"]
	if not isinstance(power_array, list):
		print("Error: The value of 'array' must be a list of integers.")
		return None

	if len(power_array) == 0:
		print("Error: The power array cannot be empty.")
		return None

	if not all(isinstance(value, int) and not isinstance(value, bool) for value in power_array):
		print("Error: The 'array' value must contain only integers.")
		return None

	assert isinstance(power_array, list), "power_array should be list"
	assert len(power_array) > 0, "power_array should not be empty"
	return power_array


def get_k(array_length):
	input_text = input("Enter sub-array size: ")
	try:
		subarray_size = int(input_text)
	except ValueError:
		print("Error: Sub-array size must be an integer.")
		return None

	if subarray_size <= 0:
		print("Error: Sub-array size must be greater than 0.")
		return None

	if subarray_size > array_length:
		print("Error: Sub-array size cannot be larger than the array length.")
		return None

	assert 1 <= subarray_size <= array_length, "subarray_size out of range"
	return subarray_size


def best_avg(power_array, subarray_size):
	assert isinstance(power_array, list), "power_array should be list"
	assert len(power_array) >= subarray_size, "subarray_size too big"
	assert subarray_size > 0, "subarray_size must be > 0"

	window_sum = sum(power_array[:subarray_size])
	best_sum = window_sum

	for index in range(subarray_size, len(power_array)):
		window_sum += power_array[index]
		window_sum -= power_array[index - subarray_size]

		if window_sum > best_sum:
			best_sum = window_sum

	average_power = best_sum / subarray_size
	assert isinstance(average_power, float), "average should be number"
	return average_power


def main():
	filename = input("Enter power data filename: ").strip()
	if filename == "":
		print("Error: Filename cannot be empty.")
		return

	power_array = get_arr(filename)
	if power_array is None:
		return

	subarray_size = get_k(len(power_array))
	if subarray_size is None:
		return

	average_power = best_avg(power_array, subarray_size)
	print(f"Average power: {average_power:.2f}")


if __name__ == "__main__":
	main()
