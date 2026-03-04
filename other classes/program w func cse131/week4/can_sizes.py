import math

class can:
    def __init__(self, name, radius, height, cost):
        self.name = name
        self.radius = radius
        self.height = height
        self.cost = cost
    #     self.volume = math.pi * (radius*radius) * height

    # def volume_formula(self, radius, height):
    #     volume = math.pi * (self.radius*self.radius) * self.height
    #     return volume


picnic_1 = can("#1 Picnic", 6.83, 10.16, 0.28)
tall_1 = can("#1 Tall", 7.78, 11.91, 0.43)
can_2 = can("#2", 8.73, 11.59, 0.45)
can_2_5 = can("#2.5", 10.32, 11.91, 0.61)
cylinder_3 = can("#3 Cylinder", 10.79, 17.78, 0.86)
can_5 = can("#5", 13.02, 14.29, 0.83)
can_6z = can("#6Z", 5.40, 8.89, 0.22)
can_8z = can("#8Z short", 6.83, 7.62, 0.26)
can_10 = can("#10", 15.72, 17.78, 1.53)
can_211 = can("#211", 6.83, 12.38, 0.34)
can_300 = can("#300", 7.62, 11.27, 0.38)
can_303 = can("#303", 8.10, 11.11, 0.42)

cans = [picnic_1, tall_1, can_2, can_2_5, cylinder_3, can_5, can_6z, can_8z, can_10, can_211, can_300, can_303]

def volume_formula(radius, height):
    volume = math.pi * (radius*radius) * height
    return volume

def area_formula(radius, height):
    surface_area = 2 * math.pi * radius * (radius + height)
    return surface_area

def eff_formula(volume, surface_area):
    efficiency = volume/surface_area
    return efficiency

def main():
    winner = 0
    # can = can()
    # volume = can.calculate_volume()
    for i in cans:
        radius = i.radius
        height = i.height
        volume = volume_formula(radius, height)
        surface_area = area_formula(radius, height)
        efficiency = eff_formula(volume, surface_area)
        print(f"{i.name} has a volume of {volume:.2f}, surface area of {surface_area:.2f}, and a storage efficiency of {efficiency:.2f}.")
        if efficiency > winner:
            winner_name = i.name
            winner_eff = efficiency
    print(f"The best can was {winner_name} with a storage efficiency of {winner_eff:.2f}.")

main()