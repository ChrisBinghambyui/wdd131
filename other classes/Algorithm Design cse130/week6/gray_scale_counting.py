import random
counter = 0 
image_sizes = [4, 8, 16, 32, 64, 128, 256, 512]

for image_size in image_sizes:
    white_pixels = 0
    number_of_rows_with_significant_white_pixels = 0

    for x in range(image_size):

        white_pixels = 0
        for y in range(image_size):
            pixel_value = random.randint(0, 255)
            counter += 1

            if pixel_value > 210:
                white_pixels += 1
           
            if white_pixels > image_size * 0.15:
                number_of_rows_with_significant_white_pixels += 1
                break

    # Print out the number of rows in this image.
    print(f'image size: {image_size}, number of white rows: {number_of_rows_with_significant_white_pixels} counter size: {counter}')